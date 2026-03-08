import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type TagItem = {
    id: string;
    name: string;
    color?: string;
    passwordCount: number;
    createdAt: string;
    updatedAt: string;
};

const fetchTags = async () => {
    const resp = await axiosInstance.get<TagItem[]>("/tags");
    return resp.data;
};

export const useTags = () => {
    return useQuery<TagItem[], AxiosError>({
        queryKey: ["tags"],
        queryFn: fetchTags,
    });
};
