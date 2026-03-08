// utils/localStorage.ts

export const localStorageUtil = {
    set<T>(key: string, value: T): void {
        if (typeof window === 'undefined') return

        try {
            const serialized = JSON.stringify(value)
            window.localStorage.setItem(key, serialized)
        } catch (error) {
            console.error(`localStorage set error for key "${key}"`, error)
        }
    },

    get<T>(key: string): T | null {
        if (typeof window === 'undefined') return null

        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : null
        } catch (error) {
            console.error(`localStorage get error for key "${key}"`, error)
            return null
        }
    },

    remove(key: string): void {
        if (typeof window === 'undefined') return

        try {
            window.localStorage.removeItem(key)
        } catch (error) {
            console.error(`localStorage remove error for key "${key}"`, error)
        }
    },

    clear(): void {
        if (typeof window === 'undefined') return

        try {
            window.localStorage.clear()
        } catch (error) {
            console.error(`localStorage clear error`, error)
        }
    },
}