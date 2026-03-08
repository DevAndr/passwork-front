import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CopyIcon, EyeIcon, EyeOffIcon, MoreVerticalIcon, PencilIcon, TrashIcon} from "lucide-react";
import type {PasswordItem} from "@/api/passwords/types.ts";
import {type FC} from "react";
import {PasswordVisibilityToggle} from "@/components/passwords/cards/PasswordVisibilityToggle.tsx";

interface Props {
    revealedId: string | null
    decryptedPassword: string
    password: PasswordItem
    handleEdit: (id: string) => void
    handleDelete: (id: string) => void
    handleCopy: (encryptedPassword: string) => void
    handleReveal: (id: string, encryptedPassword: string) => void
}

export const PasswordCard: FC<Props> = ({
                                            revealedId,
                                            decryptedPassword,
                                            password,
                                            handleEdit,
                                            handleDelete,
                                            handleCopy,
                                            handleReveal
                                        }) => {
    const isVisiblePassword = revealedId === password.id;

    return <Card key={password.id}>
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
        </CardContent>
    </Card>
}