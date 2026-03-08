import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

const deleteTag = async (id: string) => {
    await axiosInstance.delete(`/tags/${id}`);
};

export const useDeleteTag = () => {
    return useMutation<void, AxiosError, string>({
        mutationFn: deleteTag,
    });
};
