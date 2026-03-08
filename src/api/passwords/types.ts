import type {FolderItem} from "@/api/folders/types.ts";

export type PasswordItem = {
    id: string;
    title: string;
    url?: string;
    username?: string;
    encryptedPassword: string;
    encryptedNotes?: string;
    folderId?: string;
    folder?: FolderItem;
    createdAt: string;
    updatedAt: string;
};