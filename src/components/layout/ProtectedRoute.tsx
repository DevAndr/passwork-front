import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { localStorageUtil } from "@/utils/localStorage";

export default function ProtectedRoute() {
    const masterPassword = useAuthStore((s) => s.masterPassword);
    const hasToken = !!localStorageUtil.get<string>("accessToken");

    if (!hasToken) {
        return <Navigate to="/login" replace />;
    }

    if (!masterPassword) {
        return <Navigate to="/unlock" replace />;
    }

    return <Outlet />;
}
