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
import { useAuthStore } from "@/stores/authStore";
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

    const activeFolderId = searchParams.get("folderId");
    const activeTagId = searchParams.get("tagId");

    const handleLogout = () => {
        clearAuth();
        navigate("/login", { replace: true });
    };

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
                                <SidebarMenuItem key={folder.id}>
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
