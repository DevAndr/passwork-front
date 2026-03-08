import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/Logo";
import { useAuthStore } from "@/stores/authStore";

export default function UnlockPage() {
    const [masterPassword, setMasterPasswordInput] = useState("");
    const setMasterPassword = useAuthStore((s) => s.setMasterPassword);
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMasterPassword(masterPassword);
        navigate("/app", { replace: true });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <Logo size={48} />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Разблокировка</CardTitle>
                    <CardDescription>
                        Введите мастер-пароль для расшифровки данных
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-2 my-4">
                            <Label htmlFor="master">Мастер-пароль</Label>
                            <Input
                                id="master"
                                type="password"
                                value={masterPassword}
                                onChange={(e) =>
                                    setMasterPasswordInput(e.target.value)
                                }
                                placeholder="Введите мастер-пароль"
                                required
                                autoFocus
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Разблокировать
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
