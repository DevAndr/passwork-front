import { type FormEvent, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateFolder } from "@/api/folders/useCreateFolder";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parentId?: string;
};

export default function CreateFolderDialog({
    open,
    onOpenChange,
    parentId,
}: Props) {
    const [name, setName] = useState("");
    const createFolder = useCreateFolder();
    const queryClient = useQueryClient();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        createFolder.mutate(
            { name, parentId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["folders"] });
                    setName("");
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Новая папка</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="folderName">Название</Label>
                            <Input
                                id="folderName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Например: Социальные сети"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={createFolder.isPending}
                        >
                            {createFolder.isPending
                                ? "Создание..."
                                : "Создать"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
