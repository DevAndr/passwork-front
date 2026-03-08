import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    refreshToken: string;
};

type Response = {
    accessToken: string;
    refreshToken: string;
};

const refresh = async (req: Request) => {
    const resp = await axiosInstance.post<Response>("/auth/refresh", req);
    return resp.data;
};

export const useRefresh = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: refresh,
    });
};
