import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type FolderItem = {
    id: string;
    name: string;
    parentId?: string;
    children: FolderItem[];
    passwordCount: number;
    createdAt: string;
    updatedAt: string;
};

const fetchFolders = async () => {
    const resp = await axiosInstance.get<FolderItem[]>("/folders");
    return resp.data;
};

export const useFolders = () => {
    return useQuery<FolderItem[], AxiosError>({
        queryKey: ["folders"],
        queryFn: fetchFolders,
    });
};
