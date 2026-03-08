import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    title?: string;
    url?: string;
    username?: string;
    encryptedPassword?: string;
    encryptedNotes?: string;
    folderId?: string;
    tagIds?: string[];
};

type Response = {
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

const updatePassword = async ({ id, ...data }: Request & { id: string }) => {
    const resp = await axiosInstance.patch<Response>(`/passwords/${id}`, data);
    return resp.data;
};

export const useUpdatePassword = () => {
    return useMutation<Response, AxiosError, Request & { id: string }>({
        mutationFn: updatePassword,
    });
};
