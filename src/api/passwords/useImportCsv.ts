import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance.ts";

type Request = {
    file: File;
    masterPassword: string;
    salt: string;
}

type Response = {
    imported: number;
};

const importCsv = async ({file, masterPassword, salt}: Request) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("masterPassword", masterPassword);
    formData.append("salt", salt);

    const resp = await axiosInstance.post<Response>("/passwords/import/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
};

export const useImportCsv = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: importCsv,
    });
};
