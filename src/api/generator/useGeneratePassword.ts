import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Params = {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
};

const generatePassword = async (params: Params) => {
    const resp = await axiosInstance.get<string>("/generator", { params });
    return resp.data;
};

export const useGeneratePassword = (params: Params = {}, enabled = true) => {
    return useQuery<string, AxiosError>({
        queryKey: ["generator", params],
        queryFn: () => generatePassword(params),
        enabled,
    });
};
