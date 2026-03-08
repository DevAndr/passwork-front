import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    email: string;
    password: string;
    masterPasswordHash: string;
    encryptionSalt: string;
};

type Response = {
    accessToken: string;
    refreshToken: string;
};

const register = async (req: Request) => {
    const resp = await axiosInstance.post<Response>("/auth/register", req);
    return resp.data;
};

export const useRegister = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: register,
    });
};
