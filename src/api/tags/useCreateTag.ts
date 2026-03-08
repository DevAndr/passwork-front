import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    name: string;
    color?: string;
};

type Response = {
    id: string;
    name: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
};

const createTag = async (req: Request) => {
    const resp = await axiosInstance.post<Response>("/tags", req);
    return resp.data;
};

export const useCreateTag = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: createTag,
    });
};
