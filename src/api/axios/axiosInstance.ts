
import axios, { type AxiosRequestConfig } from "axios";
import {localStorageUtil} from "../../utils/localStorage.ts";

const baseURL = (import.meta.env.VITE_API_URL ?? "http://localhost:3030/api/");

const axiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

// Добавляем JWT токен к каждому запросу
axiosInstance.interceptors.request.use((config) => {
    const token = localStorageUtil.get<string>('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (!error) resolve();
        else reject(error);
    });
    failedQueue = [];
};

const redirectToLogin = () => {
    localStorageUtil.remove("accessToken");
    localStorageUtil.remove("refreshToken");
    window.location.href = "/login";
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Не перехватываем ошибки от самих auth-запросов
        if (originalRequest.url?.includes("/auth/")) {
            return Promise.reject(error);
        }

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Если уже пробовали — не зацикливаемся
        if (originalRequest._retry) {
            redirectToLogin();
            return Promise.reject(error);
        }

        const refreshToken = localStorageUtil.get<string>("refreshToken");
        if (!refreshToken) {
            redirectToLogin();
            return Promise.reject(error);
        }

        // Если уже идёт refresh — ставим запрос в очередь
        if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                return axiosInstance(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(
                `${baseURL}auth/refresh`,
                { refreshToken },
            );

            localStorageUtil.set("accessToken", data.accessToken);
            localStorageUtil.set("refreshToken", data.refreshToken);

            processQueue(null);

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            redirectToLogin();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;
