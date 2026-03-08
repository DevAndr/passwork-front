import { useState } from "react";
import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import CreateFolderDialog from "@/components/dialogs/CreateFolderDialog";
import CreateTagDialog from "@/components/dialogs/CreateTagDialog";

export default function AppLayout() {
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const [tagDialogOpen, setTagDialogOpen] = useState(false);

    return (
        <SidebarProvider>
            <AppSidebar
                onCreateFolder={() => setFolderDialogOpen(true)}
                onCreateTag={() => setTagDialogOpen(true)}
            />
            <main className="flex flex-1 flex-col">
                <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                </header>
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>

            <CreateFolderDialog
                open={folderDialogOpen}
                onOpenChange={setFolderDialogOpen}
            />
            <CreateTagDialog
                open={tagDialogOpen}
                onOpenChange={setTagDialogOpen}
            />
        </SidebarProvider>
    );
}
