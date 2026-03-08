const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export type GeneratorOptions = {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
};

export function generatePassword(options: GeneratorOptions): string {
    let charset = "";
    const required: string[] = [];

    if (options.uppercase) {
        charset += UPPERCASE;
        required.push(UPPERCASE);
    }
    if (options.lowercase) {
        charset += LOWERCASE;
        required.push(LOWERCASE);
    }
    if (options.numbers) {
        charset += DIGITS;
        required.push(DIGITS);
    }
    if (options.symbols) {
        charset += SYMBOLS;
        required.push(SYMBOLS);
    }

    if (!charset) {
        charset = LOWERCASE;
        required.push(LOWERCASE);
    }

    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    const chars = Array.from(array, (v) => charset[v % charset.length]);

    // Гарантируем хотя бы один символ из каждой включённой группы
    for (let i = 0; i < required.length && i < options.length; i++) {
        const pool = required[i];
        const rnd = new Uint32Array(1);
        crypto.getRandomValues(rnd);
        chars[i] = pool[rnd[0] % pool.length];
    }

    // Перемешиваем (Fisher-Yates)
    for (let i = chars.length - 1; i > 0; i--) {
        const rnd = new Uint32Array(1);
        crypto.getRandomValues(rnd);
        const j = rnd[0] % (i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join("");
}
