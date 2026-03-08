import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    name?: string;
    color?: string;
};

type Response = {
    id: string;
    name: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
};

const updateTag = async ({ id, ...data }: Request & { id: string }) => {
    const resp = await axiosInstance.patch<Response>(`/tags/${id}`, data);
    return resp.data;
};

export const useUpdateTag = () => {
    return useMutation<Response, AxiosError, Request & { id: string }>({
        mutationFn: updateTag,
    });
};
