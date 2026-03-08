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
import { useCreateTag } from "@/api/tags/useCreateTag";
import { useQueryClient } from "@tanstack/react-query";

const TAG_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CreateTagDialog({ open, onOpenChange }: Props) {
    const [name, setName] = useState("");
    const [color, setColor] = useState(TAG_COLORS[5]);
    const createTag = useCreateTag();
    const queryClient = useQueryClient();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        createTag.mutate(
            { name, color },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["tags"] });
                    setName("");
                    setColor(TAG_COLORS[5]);
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Новый тег</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tagName">Название</Label>
                            <Input
                                id="tagName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Например: work"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Цвет</Label>
                            <div className="flex gap-2">
                                {TAG_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className="size-8 rounded-full border-2 transition-transform hover:scale-110"
                                        style={{
                                            backgroundColor: c,
                                            borderColor:
                                                color === c
                                                    ? "white"
                                                    : "transparent",
                                        }}
                                        onClick={() => setColor(c)}
                                    />
                                ))}
                            </div>
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
                        <Button type="submit" disabled={createTag.isPending}>
                            {createTag.isPending ? "Создание..." : "Создать"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
