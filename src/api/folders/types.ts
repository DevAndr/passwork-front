
export type FolderItem = {
    id: string;
    name: string;
    parentId?: string;
    children: FolderItem[];
    _count: {
        passwords: number
    };
    createdAt: string;
    updatedAt: string;
};