import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeneratePassword } from "@/api/generator/useGeneratePassword";
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react";

export default function GeneratorPage() {
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const { data: password, refetch } = useGeneratePassword(
        { length, uppercase, lowercase, numbers, symbols },
        true,
    );

    const handleCopy = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <h1 className="text-2xl font-bold">Генератор паролей</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Сгенерированный пароль
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-muted px-4 py-3 font-mono text-lg break-all">
                            {password ?? "..."}
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
                                onClick={() => refetch()}
                            >
                                <RefreshCwIcon className="size-4" />
                            </Button>
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
