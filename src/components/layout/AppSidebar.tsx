import { type DragEvent, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useFolders } from "@/api/folders/useFolders";
import { useTags } from "@/api/tags/useTags";
import { useMe } from "@/api/auth/useMe";
import { useUpdatePassword } from "@/api/passwords/useUpdatePassword";
import { useAuthStore } from "@/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FolderIcon,
    HashIcon,
    KeyIcon,
    LogOutIcon,
    PlusIcon,
    SearchIcon,
    ShieldIcon,
} from "lucide-react";

type Props = {
    onCreateFolder: () => void;
    onCreateTag: () => void;
};

export default function AppSidebar({ onCreateFolder, onCreateTag }: Props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { data: folders } = useFolders();
    const { data: tags } = useTags();
    const { data: user } = useMe();
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const updatePassword = useUpdatePassword();
    const queryClient = useQueryClient();

    const activeFolderId = searchParams.get("folderId");
    const activeTagId = searchParams.get("tagId");

    const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

    const handleLogout = () => {
        clearAuth();
        navigate("/login", { replace: true });
    };

    const hasPasswordData = (e: DragEvent) =>
        e.dataTransfer.types.includes("application/x-password-id");

    const handleDragOver = useCallback((e: DragEvent) => {
        if (!hasPasswordData(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDragEnter = useCallback((folderId: string) => (e: DragEvent) => {
        if (!hasPasswordData(e)) return;
        e.preventDefault();
        setDragOverFolderId(folderId);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        if (!hasPasswordData(e)) return;
        const related = e.relatedTarget as Node | null;
        if (e.currentTarget.contains(related)) return;
        setDragOverFolderId(null);
    }, []);

    const handleDrop = useCallback((folderId: string) => (e: DragEvent) => {
        e.preventDefault();
        setDragOverFolderId(null);
        const passwordId = e.dataTransfer.getData("application/x-password-id");
        if (!passwordId) return;
        updatePassword.mutate(
            { id: passwordId, folderId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["passwords"] });
                    queryClient.invalidateQueries({ queryKey: ["folders"] });
                },
            },
        );
    }, [updatePassword, queryClient]);

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <Logo size={28} />
            </SidebarHeader>

            <SidebarContent>
                {/* Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => navigate("/app")}
                                    isActive={!activeFolderId && !activeTagId}
                                >
                                    <KeyIcon className="size-4" />
                                    Все пароли
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => navigate("/app/search")}
                                >
                                    <SearchIcon className="size-4" />
                                    Поиск
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => navigate("/app/generator")}
                                >
                                    <ShieldIcon className="size-4" />
                                    Генератор
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Folders */}
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between">
                        Папки
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-5"
                            onClick={onCreateFolder}
                        >
                            <PlusIcon className="size-3.5" />
                        </Button>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {folders?.map((folder) => (
                                <SidebarMenuItem
                                    key={folder.id}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter(folder.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop(folder.id)}
                                    className={
                                        dragOverFolderId === folder.id
                                            ? "rounded-md ring-2 ring-primary"
                                            : ""
                                    }
                                >
                                    <SidebarMenuButton
                                        onClick={() =>
                                            navigate(
                                                `/app?folderId=${folder.id}`,
                                            )
                                        }
                                        isActive={activeFolderId === folder.id}
                                    >
                                        <FolderIcon className="size-4" />
                                        <span className="flex-1 truncate">
                                            {folder.name}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto text-xs"
                                        >
                                            {folder._count.passwords}
                                        </Badge>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Tags */}
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between">
                        Теги
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-5"
                            onClick={onCreateTag}
                        >
                            <PlusIcon className="size-3.5" />
                        </Button>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tags?.map((tag) => (
                                <SidebarMenuItem key={tag.id}>
                                    <SidebarMenuButton
                                        onClick={() =>
                                            navigate(`/app?tagId=${tag.id}`)
                                        }
                                        isActive={activeTagId === tag.id}
                                    >
                                        <HashIcon
                                            className="size-4"
                                            style={
                                                tag.color
                                                    ? { color: tag.color }
                                                    : undefined
                                            }
                                        />
                                        <span className="flex-1 truncate">
                                            {tag.name}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto text-xs"
                                        >
                                            {tag._count.passwords}
                                        </Badge>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <div className="flex items-center justify-between">
                    <span className="truncate text-sm text-muted-foreground">
                        {user?.email}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="size-4" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
