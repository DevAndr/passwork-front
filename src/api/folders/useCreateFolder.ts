import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    name: string;
    parentId?: string;
};

type Response = {
    id: string;
    name: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
};

const createFolder = async (req: Request) => {
    const resp = await axiosInstance.post<Response>("/folders", req);
    return resp.data;
};

export const useCreateFolder = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: createFolder,
    });
};
