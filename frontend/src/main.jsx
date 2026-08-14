import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LoginPage from "./LoginPage.jsx";

export function Root() {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error(error);
        }

        setUser(null);
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return <App user={user} onLogout={handleLogout} />;
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Root />
    </StrictMode>
);