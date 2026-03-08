import {Route, Routes} from "react-router";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SplashScreen from "@/pages/SplashScreen.tsx";
import UnlockPage from "@/pages/UnlockPage";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import PasswordsPage from "@/pages/PasswordsPage";
import GeneratorPage from "@/pages/GeneratorPage";
import SearchPage from "@/pages/SearchPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unlock" element={<UnlockPage />} />
            <Route path="/app" element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route index element={<PasswordsPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="generator" element={<GeneratorPage />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App
