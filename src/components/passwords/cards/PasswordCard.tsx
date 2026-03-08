import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CopyIcon,
    EyeIcon,
    EyeOffIcon,
    FolderIcon,
    FolderOutputIcon,
    MoreVerticalIcon,
    PencilIcon,
    TrashIcon
} from "lucide-react";
import type {PasswordItem} from "@/api/passwords/types.ts";
import type {DragEvent, FC} from "react";
import {PasswordVisibilityToggle} from "@/components/passwords/cards/PasswordVisibilityToggle.tsx";

type FolderOption = {
    id: string;
    name: string;
};

interface Props {
    revealedId: string | null
    decryptedPassword: string
    password: PasswordItem
    folders?: FolderOption[]
    handleEdit: (id: string) => void
    handleDelete: (id: string) => void
    handleCopy: (encryptedPassword: string) => void
    handleReveal: (id: string, encryptedPassword: string) => void
    handleMove: (id: string, folderId: string | null) => void
}

export const PasswordCard: FC<Props> = ({
                                            revealedId,
                                            decryptedPassword,
                                            password,
                                            folders,
                                            handleEdit,
                                            handleDelete,
                                            handleCopy,
                                            handleReveal,
                                            handleMove,
                                        }) => {
    const isVisiblePassword = revealedId === password.id;

    const onDragStart = (e: DragEvent) => {
        e.dataTransfer.setData("application/x-password-id", password.id);
        e.dataTransfer.effectAllowed = "move";
    };

    console.log(password)

    return <Card key={password.id} draggable onDragStart={onDragStart} className="cursor-grab active:cursor-grabbing">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
                <CardTitle className="text-base">
                    {password.title}
                </CardTitle>
                {password.url && (
                    <CardDescription className="text-xs">
                        {password.url}
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
                        <MoreVerticalIcon className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='w-[180]'>
                    <DropdownMenuItem
                        onClick={() => handleEdit(password.id)}
                    >
                        <PencilIcon className="mr-2 size-4"/>
                        Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            handleCopy(
                                password.encryptedPassword,
                            )
                        }
                    >
                        <CopyIcon className="mr-2 size-4"/>
                        Копировать пароль
                    </DropdownMenuItem>
                    {folders && folders.length > 0 && (
                        <>
                            <DropdownMenuSeparator/>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <FolderOutputIcon className="mr-2 size-4"/>
                                    Переместить
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() => handleMove(password.id, null)}
                                        disabled={!password.folderId}
                                    >
                                        <FolderIcon className="mr-2 size-4"/>
                                        Без папки
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    {folders.map((folder) => (
                                        <DropdownMenuItem
                                            key={folder.id}
                                            onClick={() => handleMove(password.id, folder.id)}
                                            disabled={password.folderId === folder.id}
                                        >
                                            <FolderIcon className="mr-2 size-4"/>
                                            {folder.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </>
                    )}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onClick={() => handleDelete(password.id)}
                        className="text-destructive"
                    >
                        <TrashIcon className="mr-2 size-4"/>
                        Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <CardContent>
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-2 text-sm">
                    {password.username && (
                        <span className="text-muted-foreground">
                                            {password.username}
                                        </span>
                    )}
                    <PasswordVisibilityToggle isVisible={isVisiblePassword} decryptedPassword={decryptedPassword}/>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 cursor-pointer"
                        onClick={() =>
                            handleReveal(
                                password.id,
                                password.encryptedPassword,
                            )
                        }
                    >
                        {isVisiblePassword ? (
                            <EyeOffIcon className="size-3.5"/>
                        ) : (
                            <EyeIcon className="size-3.5"/>
                        )}
                    </Button>
                </div>
                {password?.folder &&
                    <div className='flex items-center gap-2'>
                        {password?.folder?.name}
                        <FolderIcon className="size-3"/>
                    </div>}
            </div>
        </CardContent>
    </Card>
}