import { useState } from "react";
import { usePasswords } from "@/api/passwords/usePasswords";
import { useDeletePassword } from "@/api/passwords/useDeletePassword";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
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
import {
    CopyIcon,
    EyeIcon,
    EyeOffIcon,
    MoreVerticalIcon,
    SearchIcon,
    TrashIcon,
} from "lucide-react";
import { decrypt } from "@/lib/crypto";
import { useAuthStore } from "@/stores/authStore";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const { data: passwords } = usePasswords({
        search: query || undefined,
    });
    const deletePassword = useDeletePassword();
    const queryClient = useQueryClient();

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
            const plain = await decrypt(
                encryptedPassword,
                masterPassword,
                salt,
            );
            setDecryptedPassword(plain);
            setRevealedId(id);
        } catch {
            setDecryptedPassword("Ошибка расшифровки");
            setRevealedId(id);
        }
    };

    const handleCopy = async (encryptedPassword: string) => {
        const salt = getEncryptionSalt();
        if (!masterPassword || !salt) return;
        try {
            const plain = await decrypt(
                encryptedPassword,
                masterPassword,
                salt,
            );
            await navigator.clipboard.writeText(plain);
        } catch {
            // ignore
        }
    };

    const handleDelete = (id: string) => {
        deletePassword.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["passwords"] });
            },
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Поиск</h1>

            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по названию, URL или имени пользователя..."
                    className="pl-10"
                />
            </div>

            {query && !passwords?.length && (
                <p className="text-center text-muted-foreground">
                    Ничего не найдено
                </p>
            )}

            <div className="grid gap-3">
                {passwords?.map((pw) => (
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
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCopy(pw.encryptedPassword)
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
        </div>
    );
}
