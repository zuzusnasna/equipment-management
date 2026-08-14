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

            const response = await fetch(
                "http://localhost:8080/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        loginId: loginId.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    "아이디 또는 비밀번호가 올바르지 않습니다."
                );
            }

            onLogin(data);

        } catch (error) {
            console.error("로그인 오류:", error);

            setError(
                error.message ||
                "로그인에 실패했습니다."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="login-icon">
                        ⚙
                    </div>

                    <h1>
                        장비 관리 시스템
                    </h1>

                    <p>
                        Equipment Management System
                    </p>

                </div>


                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="login-form-group">

                        <label htmlFor="loginId">
                            아이디
                        </label>

                        <input
                            id="loginId"
                            type="text"
                            value={loginId}
                            onChange={(e) =>
                                setLoginId(e.target.value)
                            }
                            placeholder="아이디를 입력하세요"
                            autoComplete="username"
                            disabled={loading}
                        />

                    </div>


                    <div className="login-form-group">

                        <label htmlFor="password">
                            비밀번호
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="current-password"
                            disabled={loading}
                        />

                    </div>


                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "로그인 중..."
                            : "로그인"}
                    </button>

                </form>


                <div className="login-footer">
                    Equipment Management System
                </div>

            </div>

        </div>
    );
}

export default LoginPage;