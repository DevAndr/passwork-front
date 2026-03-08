import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type PasswordDetail = {
    id: string;
    title: string;
    url?: string;
    username?: string;
    encryptedPassword: string;
    encryptedNotes?: string;
    folderId?: string;
    createdAt: string;
    updatedAt: string;
    history: {
        id: string;
        encryptedPassword: string;
        changedAt: string;
    }[];
};

const fetchPassword = async (id: string) => {
    const resp = await axiosInstance.get<PasswordDetail>(`/passwords/${id}`);
    return resp.data;
};

export const usePassword = (id: string) => {
    return useQuery<PasswordDetail, AxiosError>({
        queryKey: ["passwords", id],
        queryFn: () => fetchPassword(id),
        enabled: !!id,
    });
};
