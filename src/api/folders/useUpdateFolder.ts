import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    name?: string;
    parentId?: string;
};

type Response = {
    id: string;
    name: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
};

const updateFolder = async ({ id, ...data }: Request & { id: string }) => {
    const resp = await axiosInstance.patch<Response>(`/folders/${id}`, data);
    return resp.data;
};

export const useUpdateFolder = () => {
    return useMutation<Response, AxiosError, Request & { id: string }>({
        mutationFn: updateFolder,
    });
};
