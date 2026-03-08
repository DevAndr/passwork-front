import type {FolderItem} from "@/api/folders/types.ts";

type Tag = {
    tagId: string;
    passwordId: string;
    tag: {
        "id": string;
        "userId": string;
        "name": string;
        "color": string;
        "createdAt": string;
        "updatedAt": string;
    }
}

export type PasswordItem = {
    id: string;
    title: string;
    url?: string;
    username?: string;
    encryptedPassword: string;
    encryptedNotes?: string;
    folderId?: string;
    folder?: FolderItem;
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
};