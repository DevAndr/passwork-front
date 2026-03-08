import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
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
import { useRegister } from "@/api/auth/useRegister";
import { localStorageUtil } from "@/utils/localStorage";
import Logo from "@/components/Logo.tsx";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [masterPassword, setMasterPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const navigate = useNavigate();
    const register = useRegister();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setValidationError("");

        if (password !== confirmPassword) {
            setValidationError("Пароли не совпадают");
            return;
        }

        if (password.length < 8) {
            setValidationError("Пароль должен быть не менее 8 символов");
            return;
        }

        if (!masterPassword) {
            setValidationError("Мастер-пароль обязателен");
            return;
        }

        // Derive masterPasswordHash and encryptionSalt on the client
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const encryptionSalt = Array.from(salt)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(masterPassword),
            "PBKDF2",
            false,
            ["deriveBits"],
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt,
                iterations: 600000,
                hash: "SHA-256",
            },
            keyMaterial,
            256,
        );

        const masterPasswordHash = Array.from(new Uint8Array(derivedBits))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        register.mutate(
            { email, password, masterPasswordHash, encryptionSalt },
            {
                onSuccess: (data) => {
                    localStorageUtil.set("accessToken", data.accessToken);
                    localStorageUtil.set("refreshToken", data.refreshToken);
                    localStorageUtil.set("encryptionSalt", encryptionSalt);
                    navigate("/");
                },
            },
        );
    };

    const errorMessage =
        validationError ||
        (register.isError
            ? register.error?.response?.status === 409
                ? "Пользователь с таким email уже существует"
                : "Ошибка при регистрации. Попробуйте позже."
            : "");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Logo className='mb-6' />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Регистрация</CardTitle>
                    <CardDescription>
                        Создайте аккаунт для хранения паролей
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
                        <div className="space-y-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Минимум 8 символов"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Подтвердите пароль
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Повторите пароль"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2 my-4">
                            <Label htmlFor="masterPassword">
                                Мастер-пароль
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Используется для шифрования ваших данных. Запомните его — восстановить невозможно.
                            </p>
                            <Input
                                id="masterPassword"
                                type="password"
                                placeholder="Мастер-пароль"
                                value={masterPassword}
                                onChange={(e) =>
                                    setMasterPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                        {errorMessage && (
                            <p className="text-sm text-destructive">
                                {errorMessage}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={register.isPending}
                        >
                            {register.isPending
                                ? "Регистрация..."
                                : "Зарегистрироваться"}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Уже есть аккаунт?{" "}
                            <Link
                                to="/login"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Войти
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
