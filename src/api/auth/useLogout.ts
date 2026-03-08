import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    refreshToken: string;
};

const logout = async (req: Request) => {
    const resp = await axiosInstance.post("/auth/logout", req);
    return resp.data;
};

export const useLogout = () => {
    return useMutation<void, AxiosError, Request>({
        mutationFn: logout,
    });
};
