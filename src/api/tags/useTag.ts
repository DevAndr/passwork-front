import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type TagDetail = {
    id: string;
    name: string;
    color?: string;
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

const fetchTag = async (id: string) => {
    const resp = await axiosInstance.get<TagDetail>(`/tags/${id}`);
    return resp.data;
};

export const useTag = (id: string) => {
    return useQuery<TagDetail, AxiosError>({
        queryKey: ["tags", id],
        queryFn: () => fetchTag(id),
        enabled: !!id,
    });
};
