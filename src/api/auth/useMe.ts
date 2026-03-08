import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Response = {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

const fetchMe = async () => {
    const resp = await axiosInstance.get<Response>("/auth/me");
    return resp.data;
};

export const useMe = () => {
    return useQuery<Response, AxiosError>({
        queryKey: ["auth", "me"],
        queryFn: fetchMe,
    });
};
