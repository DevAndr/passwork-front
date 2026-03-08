
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    email: string
    password: string
}

type Response = {
    accessToken: string
    refreshToken: string
}

const login = async (req: Request) => {
    const resp = await axiosInstance.post<Response>("/auth/login", req)
    return resp.data
}

export const useLogin = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: login
    })
}
