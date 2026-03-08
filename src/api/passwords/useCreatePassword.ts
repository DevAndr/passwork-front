import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    title: string;
    encryptedPassword: string;
    url?: string;
    username?: string;
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
    tagIds?: string[];
    createdAt: string;
    updatedAt: string;
};

const createPassword = async (req: Request) => {
    const resp = await axiosInstance.post<Response>("/passwords", req);
    return resp.data;
};

export const useCreatePassword = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: createPassword,
    });
};
