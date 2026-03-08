import { create } from "zustand";
import { localStorageUtil } from "@/utils/localStorage";

type AuthState = {
    masterPassword: string | null;
    setMasterPassword: (mp: string) => void;
    clearAuth: () => void;
    getEncryptionSalt: () => string | null;
};

export const useAuthStore = create<AuthState>((set) => ({
    masterPassword: null,
    setMasterPassword: (mp) => set({ masterPassword: mp }),
    clearAuth: () => {
        localStorageUtil.remove("accessToken");
        localStorageUtil.remove("refreshToken");
        localStorageUtil.remove("encryptionSalt");
        set({ masterPassword: null });
    },
    getEncryptionSalt: () => localStorageUtil.get<string>("encryptionSalt"),
}));
