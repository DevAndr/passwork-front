import {useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router";
import {usePasswords} from "@/api/passwords/usePasswords";
import {useDeletePassword} from "@/api/passwords/useDeletePassword";
import {useUpdatePassword} from "@/api/passwords/useUpdatePassword";
import {useImportCsv} from "@/api/passwords/useImportCsv";
import {useFolders} from "@/api/folders/useFolders";
import {useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ImportIcon, PlusIcon, SearchIcon, XIcon} from "lucide-react";
import {decrypt} from "@/lib/crypto";
import {useAuthStore} from "@/stores/authStore";
import PasswordDialog from "@/components/dialogs/PasswordDialog";
import {Spinner} from "@/components/ui/spinner";
import {PasswordCard} from "@/components/passwords/cards/PasswordCard.tsx";

export default function PasswordsPage() {
    const [searchParams] = useSearchParams();
    const folderId = searchParams.get("folderId") ?? undefined;

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const {data: passwords, isLoading} = usePasswords({
        folderId,
        search: debouncedSearch || undefined,
    });
    const {data: folders} = useFolders();
    const deletePassword = useDeletePassword();
    const updatePassword = useUpdatePassword();
    const queryClient = useQueryClient();

    const importCsv = useImportCsv();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                queryClient.invalidateQueries({queryKey: ["passwords"]});
                queryClient.invalidateQueries({queryKey: ["folders"]});
            },
        });
    };

    const handleMove = (id: string, newFolderId: string | null) => {
        updatePassword.mutate(
            {id, folderId: newFolderId ?? undefined},
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: ["passwords"]});
                    queryClient.invalidateQueries({queryKey: ["folders"]});
                },
            },
        );
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingId(undefined);
        setDialogOpen(true);
    };

    const handleImportCsv = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const salt = getEncryptionSalt();

        if (!file || !masterPassword || !salt) return;

        importCsv.mutate({file, masterPassword, salt}, {
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["passwords"]});
                queryClient.invalidateQueries({queryKey: ["folders"]});
            },
            onSettled: () => {
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className='top-0 sticky bg-[#090909] rounded-xl p-2'>
                <div className="flex items-center justify-between pb-2">
                    <h1 className="text-2xl font-bold">Пароли {passwords?.length}</h1>
                    <div className="flex items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outline"
                            onClick={handleImportCsv}
                            disabled={importCsv.isPending}
                        >
                            <ImportIcon className="mr-2 size-4"/>
                            {importCsv.isPending ? "Импорт..." : "Импорт CSV"}
                        </Button>
                        <Button onClick={handleCreate}>
                            <PlusIcon className="mr-2 size-4"/>
                            Добавить
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Поиск паролей..."
                        className="pl-9 pr-9"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => setSearchInput("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <XIcon className="size-4"/>
                        </button>
                    )}
                </div>
            </div>

            {!passwords?.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    {debouncedSearch ? (
                        <p>Ничего не найдено по запросу &laquo;{debouncedSearch}&raquo;</p>
                    ) : (
                        <>
                            <p>Нет сохранённых паролей</p>
                            <Button
                                variant="link"
                                className="mt-2"
                                onClick={handleCreate}
                            >
                                Добавить первый пароль
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-3">
                    {passwords.map((password) => (
                        <PasswordCard
                            key={password.id}
                            revealedId={revealedId}
                            decryptedPassword={decryptedPassword}
                            password={password}
                            folders={folders}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            handleCopy={handleCopy}
                            handleReveal={handleReveal}
                            handleMove={handleMove}
                        />
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
