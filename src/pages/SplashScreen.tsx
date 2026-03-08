import { useEffect } from "react";
import { useNavigate } from "react-router";
import Logo from "@/components/Logo";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useMe } from "@/api/auth/useMe";

export default function SplashScreen() {
    const navigate = useNavigate();
    const { isSuccess, isError } = useMe();

    useEffect(() => {
        if (!isSuccess && !isError) return;

        const timeout = setTimeout(() => {
            navigate(isSuccess ? "/unlock" : "/login", { replace: true });
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isSuccess, isError, navigate]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <Logo size={64} className="animate-pulse" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner />
                Загрузка...
            </div>
        </div>
    );
}
