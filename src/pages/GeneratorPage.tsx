import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react";
import { generatePassword } from "@/lib/generatePassword";

export default function GeneratorPage() {
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const generate = useCallback(() => {
        setPassword(generatePassword({ length, uppercase, lowercase, numbers, symbols }));
        setCopied(false);
    }, [length, uppercase, lowercase, numbers, symbols]);

    useEffect(() => {
        generate();
    }, [generate]);

    const handleCopy = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const strength = getStrength(length, [uppercase, lowercase, numbers, symbols].filter(Boolean).length);

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <h1 className="text-2xl font-bold">Генератор паролей</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Сгенерированный пароль
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-muted px-4 py-3 font-mono text-lg break-all select-all">
                            {password}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <CheckIcon className="size-4" />
                                ) : (
                                    <CopyIcon className="size-4" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={generate}
                            >
                                <RefreshCwIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Надёжность</span>
                            <span className={strengthColor(strength)}>{strengthLabel(strength)}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className={`h-full transition-all ${strengthBarColor(strength)}`}
                                style={{ width: `${(strength / 4) * 100}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Длина</Label>
                            <span className="text-sm font-medium tabular-nums">
                                {length}
                            </span>
                        </div>
                        <Slider
                            value={[length]}
                            onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)}
                            min={4}
                            max={128}
                            step={1}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="gen-upper">
                            Заглавные буквы (A-Z)
                        </Label>
                        <Switch
                            id="gen-upper"
                            checked={uppercase}
                            onCheckedChange={setUppercase}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="gen-lower">
                            Строчные буквы (a-z)
                        </Label>
                        <Switch
                            id="gen-lower"
                            checked={lowercase}
                            onCheckedChange={setLowercase}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="gen-numbers">Цифры (0-9)</Label>
                        <Switch
                            id="gen-numbers"
                            checked={numbers}
                            onCheckedChange={setNumbers}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="gen-symbols">Символы (!@#$...)</Label>
                        <Switch
                            id="gen-symbols"
                            checked={symbols}
                            onCheckedChange={setSymbols}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function getStrength(length: number, poolCount: number): number {
    if (length >= 20 && poolCount >= 3) return 4;
    if (length >= 12 && poolCount >= 3) return 3;
    if (length >= 8 && poolCount >= 2) return 2;
    return 1;
}

function strengthLabel(s: number): string {
    if (s >= 4) return "Отличный";
    if (s >= 3) return "Хороший";
    if (s >= 2) return "Средний";
    return "Слабый";
}

function strengthColor(s: number): string {
    if (s >= 4) return "text-green-600";
    if (s >= 3) return "text-blue-600";
    if (s >= 2) return "text-yellow-600";
    return "text-red-600";
}

function strengthBarColor(s: number): string {
    if (s >= 4) return "bg-green-600";
    if (s >= 3) return "bg-blue-600";
    if (s >= 2) return "bg-yellow-600";
    return "bg-red-600";
}
