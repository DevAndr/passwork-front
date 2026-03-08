import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

const deletePassword = async (id: string) => {
    await axiosInstance.delete(`/passwords/${id}`);
};

export const useDeletePassword = () => {
    return useMutation<void, AxiosError, string>({
        mutationFn: deletePassword,
    });
};
