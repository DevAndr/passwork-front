import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Params = {
    search?: string;
    folderId?: string;
};

type PasswordItem = {
    id: string;
    title: string;
    url?: string;
    username?: string;
    encryptedPassword: string;
    encryptedNotes?: string;
    folderId?: string;
    createdAt: string;
    updatedAt: string;
};

const fetchPasswords = async (params: Params) => {
    const resp = await axiosInstance.get<PasswordItem[]>("/passwords", { params });
    return resp.data;
};

export const usePasswords = (params: Params = {}) => {
    return useQuery<PasswordItem[], AxiosError>({
        queryKey: ["passwords", params],
        queryFn: () => fetchPasswords(params),
    });
};
