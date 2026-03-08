import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type FolderDetail = {
    id: string;
    name: string;
    parentId?: string;
    children: FolderDetail[];
    passwords: {
        id: string;
        title: string;
        url?: string;
        username?: string;
        encryptedPassword: string;
        createdAt: string;
        updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
};

const fetchFolder = async (id: string) => {
    const resp = await axiosInstance.get<FolderDetail>(`/folders/${id}`);
    return resp.data;
};

export const useFolder = (id: string) => {
    return useQuery<FolderDetail, AxiosError>({
        queryKey: ["folders", id],
        queryFn: () => fetchFolder(id),
        enabled: !!id,
    });
};
