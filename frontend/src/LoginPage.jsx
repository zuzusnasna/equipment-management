import { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginId.trim() || !password) {
            setError("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    loginId: loginId.trim(),
                    password,
                }),
            });

            const contentType = response.headers.get("content-type") || "";
            let data;

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || "아이디 또는 비밀번호가 올바르지 않습니다.";

                throw new Error(message);
            }

            onLogin(data);
        } catch (error) {
            console.error("로그인 오류:", error);
            setError(error.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">⚙️</div>
                    <h1>장비 관리 시스템</h1>
                    <p>EQUIPMENT MANAGEMENT SYSTEM</p>
                </div>

                <div>
                    <h2 className="login-title">로그인</h2>
                    <p className="login-description">
                        장비 관리 시스템을 이용하려면 로그인해주세요.
                    </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label htmlFor="loginId">아이디</label>
                        <input
                            id="loginId"
                            type="text"
                            placeholder="아이디를 입력하세요"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="login-footer">Equipment Management Service</div>
            </div>
        </div>
    );
}

export default LoginPage;
