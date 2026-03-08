import {type FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {useLogin} from "@/api/auth/useLogin";
import {localStorageUtil} from "@/utils/localStorage";
import Logo from "@/components/Logo.tsx";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const login = useLogin();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login.mutate(
            {email, password},
            {
                onSuccess: (data) => {
                    localStorageUtil.set("accessToken", data.accessToken);
                    localStorageUtil.set("refreshToken", data.refreshToken);
                    navigate("/unlock");
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Logo className='mb-6' />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Вход</CardTitle>
                    <CardDescription>
                        Введите email и пароль для входа в аккаунт
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 my-4">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {login.isError && (
                            <p className="text-sm text-destructive">
                                {login.error?.response?.status === 401
                                    ? "Неверный email или пароль"
                                    : "Ошибка при входе. Попробуйте позже."}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={login.isPending}
                        >
                            {login.isPending ? "Вход..." : "Войти"}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Нет аккаунта?{" "}
                            <Link
                                to="/register"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Зарегистрироваться
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
