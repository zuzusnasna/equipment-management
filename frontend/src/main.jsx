import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx?ui=20260914-3";
import LoginPage from "./LoginPage.jsx";

// 기존 브라우저 캐시나 중복 CSS가 남아 있어도
// 현재 App.jsx 레이아웃이 정상적으로 표시되도록 핵심 레이아웃 스타일을 우선 적용합니다.
const runtimeStyle = document.createElement("style");
runtimeStyle.setAttribute("data-equipment-ui", "20260914-3");
runtimeStyle.textContent = `
  .app-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 24px !important;
  }

  .app-header > div:first-child {
    width: auto !important;
    max-width: none !important;
    margin: 0 !important;
    min-width: 0 !important;
  }

  .app-header > .header-user {
    width: auto !important;
    max-width: none !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .form-group textarea {
    min-height: 100px !important;
    padding: 12px 13px !important;
    resize: vertical !important;
  }

  .table-wrapper {
    width: 100% !important;
    overflow-x: auto !important;
  }

  .table-wrapper table {
    width: 100% !important;
    min-width: 900px !important;
    border-collapse: collapse !important;
  }

  @media (max-width: 760px) {
    .app-header {
      align-items: flex-start !important;
      flex-direction: column !important;
      padding: 24px !important;
    }

    .app-header > .header-user {
      width: 100% !important;
      justify-content: space-between !important;
    }
  }
`;
document.head.appendChild(runtimeStyle);

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