import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";
import type {FolderItem} from "@/api/folders/types.ts";

type Response = FolderItem[]

const fetchFolders = async () => {
    const resp = await axiosInstance.get<Response>("/folders");
    return resp.data;
};

export const useFolders = () => {
    return useQuery<Response, AxiosError>({
        queryKey: ["folders"],
        queryFn: fetchFolders,
    });
};
