import { useState } from "react";
import { useSearchParams } from "react-router";
import { usePasswords } from "@/api/passwords/usePasswords";
import { useDeletePassword } from "@/api/passwords/useDeletePassword";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIcon, EyeIcon, EyeOffIcon, MoreVerticalIcon, PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import { decrypt } from "@/lib/crypto";
import { useAuthStore } from "@/stores/authStore";
import PasswordDialog from "@/components/dialogs/PasswordDialog";
import { Spinner } from "@/components/ui/spinner";

export default function PasswordsPage() {
    const [searchParams] = useSearchParams();
    const folderId = searchParams.get("folderId") ?? undefined;
    const { data: passwords, isLoading } = usePasswords({ folderId });
    const deletePassword = useDeletePassword();
    const queryClient = useQueryClient();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [revealedId, setRevealedId] = useState<string | null>(null);
    const [decryptedPassword, setDecryptedPassword] = useState("");

    const masterPassword = useAuthStore((s) => s.masterPassword);
    const getEncryptionSalt = useAuthStore((s) => s.getEncryptionSalt);


    const handleReveal = async (id: string, encryptedPassword: string) => {
        if (revealedId === id) {
            setRevealedId(null);
            setDecryptedPassword("");
            return;
        }
        const salt = getEncryptionSalt();
        if (!masterPassword || !salt) return;
        try {
            const plain = await decrypt(encryptedPassword, masterPassword, salt);
            setDecryptedPassword(plain);
            setRevealedId(id);
        } catch {
            console.log('error')
            setDecryptedPassword("Ошибка расшифровки");
            setRevealedId(id);
        }
    };

    const handleCopy = async (encryptedPassword: string) => {
        const salt = getEncryptionSalt();
        if (!masterPassword || !salt) return;
        try {
            const plain = await decrypt(encryptedPassword, masterPassword, salt);
            await navigator.clipboard.writeText(plain);
        } catch {
            // ignore
        }
    };

    const handleDelete = (id: string) => {
        deletePassword.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["passwords"] });
                queryClient.invalidateQueries({ queryKey: ["folders"] });
            },
        });
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingId(undefined);
        setDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Пароли</h1>
                <Button onClick={handleCreate}>
                    <PlusIcon className="mr-2 size-4" />
                    Добавить
                </Button>
            </div>

            {!passwords?.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>Нет сохранённых паролей</p>
                    <Button
                        variant="link"
                        className="mt-2"
                        onClick={handleCreate}
                    >
                        Добавить первый пароль
                    </Button>
                </div>
            ) : (
                <div className="grid gap-3">
                    {passwords.map((pw) => (
                        <Card key={pw.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div>
                                    <CardTitle className="text-base">
                                        {pw.title}
                                    </CardTitle>
                                    {pw.url && (
                                        <CardDescription className="text-xs">
                                            {pw.url}
                                        </CardDescription>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                        >
                                            <MoreVerticalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className='w-[180]'>
                                        <DropdownMenuItem
                                            onClick={() => handleEdit(pw.id)}
                                        >
                                            <PencilIcon className="mr-2 size-4" />
                                            Редактировать
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleCopy(
                                                    pw.encryptedPassword,
                                                )
                                            }
                                        >
                                            <CopyIcon className="mr-2 size-4" />
                                            Копировать пароль
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(pw.id)}
                                            className="text-destructive"
                                        >
                                            <TrashIcon className="mr-2 size-4" />
                                            Удалить
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm">
                                    {pw.username && (
                                        <span className="text-muted-foreground">
                                            {pw.username}
                                        </span>
                                    )}
                                    <span className="font-mono">
                                        {revealedId === pw.id
                                            ? decryptedPassword
                                            : "••••••••"}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-6"
                                        onClick={() =>
                                            handleReveal(
                                                pw.id,
                                                pw.encryptedPassword,
                                            )
                                        }
                                    >
                                        {revealedId === pw.id ? (
                                            <EyeOffIcon className="size-3.5" />
                                        ) : (
                                            <EyeIcon className="size-3.5" />
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <PasswordDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editId={editingId}
                defaultFolderId={folderId}
            />
        </div>
    );
}
