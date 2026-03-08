import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";
import type {PasswordItem} from "@/api/passwords/types.ts";

type Request = {
    search?: string;
    folderId?: string;
};

type Response = PasswordItem[]

const fetchPasswords = async (params: Request) => {
    const resp = await axiosInstance.get<Response>("/passwords", { params });
    return resp.data;
};

export const usePasswords = (params: Request = {}) => {
    return useQuery<Response, AxiosError>({
        queryKey: ["passwords", params],
        queryFn: () => fetchPasswords(params),
    });
};
