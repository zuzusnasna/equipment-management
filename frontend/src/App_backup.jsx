import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import EquipmentPage from "./EquipmentPage";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/me", {
      method: "GET",
      credentials: "include",
    })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("로그인되지 않음");
          }

          return response.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          setChecking(false);
        });
  }, []);

  const handleLogin = (loginUser) => {
    setUser(loginUser);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };

  if (checking) {
    return <div>로그인 상태 확인 중...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
      <EquipmentPage
          user={user}
          onLogout={handleLogout}
      />
  );
}

export default App;