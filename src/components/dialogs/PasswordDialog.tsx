import {type FormEvent, useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useCreatePassword} from "@/api/passwords/useCreatePassword";
import {useUpdatePassword} from "@/api/passwords/useUpdatePassword";
import {usePassword} from "@/api/passwords/usePassword";
import {useFolders} from "@/api/folders/useFolders";
import {useTags} from "@/api/tags/useTags";
import {useQueryClient} from "@tanstack/react-query";
import {encrypt, decrypt} from "@/lib/crypto";
import {useAuthStore} from "@/stores/authStore";
import {Badge} from "@/components/ui/badge";
import {XIcon} from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editId?: string;
    defaultFolderId?: string;
};

export default function PasswordDialog({
                                           open,
                                           onOpenChange,
                                           editId,
                                           defaultFolderId,
                                       }: Props) {
    const isEdit = !!editId;
    const {data: existing} = usePassword(editId ?? "");
    const {data: folders} = useFolders();
    const {data: tags} = useTags();
    const createPassword = useCreatePassword();
    const updatePassword = useUpdatePassword();
    const queryClient = useQueryClient();

    const masterPassword = useAuthStore((s) => s.masterPassword);
    const getEncryptionSalt = useAuthStore((s) => s.getEncryptionSalt);

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notes, setNotes] = useState("");
    const [folderId, setFolderId] = useState<string>("");
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    useEffect(() => {
        if (!open) return;
        if (isEdit && existing) {
            setTitle(existing.title);
            setUrl(existing.url ?? "");
            setUsername(existing.username ?? "");
            setFolderId(existing.folderId ?? "");
            // Decrypt password and notes for editing
            const salt = getEncryptionSalt();
            if (masterPassword && salt) {
                decrypt(existing.encryptedPassword, masterPassword, salt)
                    .then(setPassword)
                    .catch(() => setPassword(""));
                if (existing.encryptedNotes) {
                    decrypt(existing.encryptedNotes, masterPassword, salt)
                        .then(setNotes)
                        .catch(() => setNotes(""));
                } else {
                    setNotes("");
                }
            }
        } else {
            setTitle("");
            setUrl("");
            setUsername("");
            setPassword("");
            setNotes("");
            setFolderId(defaultFolderId ?? "");
            setSelectedTagIds([]);
        }
    }, [open, isEdit, existing, masterPassword, getEncryptionSalt, defaultFolderId]);

    const toggleTag = (tagId: string) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId],
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const salt = getEncryptionSalt();
        if (!masterPassword || !salt) return;

        const encryptedPassword = await encrypt(password, masterPassword, salt);
        const encryptedNotes = notes
            ? await encrypt(notes, masterPassword, salt)
            : undefined;

        const payload = {
            title,
            url: url || undefined,
            username: username || undefined,
            encryptedPassword,
            encryptedNotes,
            folderId: folderId || undefined,
            tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        };

        const onSuccess = () => {
            queryClient.invalidateQueries({queryKey: ["passwords"]});
            queryClient.invalidateQueries({queryKey: ["folders"]});
            queryClient.invalidateQueries({queryKey: ["tags"]});
            onOpenChange(false);
        };

        if (isEdit) {
            updatePassword.mutate(
                {id: editId, ...payload},
                {onSuccess},
            );
        } else {
            createPassword.mutate(payload, {onSuccess});
        }
    };

    const isPending = createPassword.isPending || updatePassword.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Редактировать пароль" : "Новый пароль"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="pw-title">Название</Label>
                            <Input
                                id="pw-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Gmail"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pw-url">URL</Label>
                            <Input
                                id="pw-url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://mail.google.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pw-username">
                                Имя пользователя
                            </Label>
                            <Input
                                id="pw-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="user@gmail.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pw-password">Пароль</Label>
                            <Input
                                id="pw-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pw-notes">Заметки</Label>
                            <Textarea
                                id="pw-notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Дополнительные заметки..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Папка</Label>
                            <Select
                                value={folderId}
                                itemToStringLabel={(item) => {
                                    const folder = (folders || []).find(folder => folder.id === item)
                                    return folder?.name || ''
                                }}
                                onValueChange={(value) => setFolderId(value ?? "")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Без папки"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="">Без папки</SelectItem>
                                        {folders?.map((folder) => (
                                            <SelectItem key={folder.id} value={folder.id}>
                                                {folder.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {tags && tags.length > 0 && (
                            <div className="space-y-2">
                                <Label>Теги</Label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant={
                                                selectedTagIds.includes(tag.id)
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="cursor-pointer"
                                            style={
                                                selectedTagIds.includes(tag.id) && tag.color
                                                    ? {backgroundColor: tag.color}
                                                    : undefined
                                            }
                                            onClick={() => toggleTag(tag.id)}
                                        >
                                            {tag.name}
                                            {selectedTagIds.includes(
                                                tag.id,
                                            ) && (
                                                <XIcon className="ml-1 size-3"/>
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Отмена
                        </Button>
                        <Button type="submit"  >
                            {isPending
                                ? "Сохранение..."
                                : isEdit
                                    ? "Сохранить"
                                    : "Создать"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
