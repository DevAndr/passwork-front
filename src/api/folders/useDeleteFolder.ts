import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

const deleteFolder = async (id: string) => {
    await axiosInstance.delete(`/folders/${id}`);
};

export const useDeleteFolder = () => {
    return useMutation<void, AxiosError, string>({
        mutationFn: deleteFolder,
    });
};
