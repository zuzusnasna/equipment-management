import { useState } from "react";
import { login } from "./api/authApi";
import "./Login.css";

function Login({ onLogin }) {
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

            const user = await login(
                loginId.trim(),
                password
            );

            onLogin(user);
        } catch (err) {
            console.error("로그인 오류:", err);

            setError(
                "아이디 또는 비밀번호가 올바르지 않습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* 헤더 */}
                <div className="login-header">

                    <div className="login-brand">
                        <div className="login-brand-mark">
                            ⚙
                        </div>

                        <div>
                            <h1>장비 관리 시스템</h1>

                            <p>
                                Equipment Management System
                            </p>
                        </div>
                    </div>

                </div>

                {/* 로그인 영역 */}
                <div className="login-content">

                    <div className="login-title">
                        <h2>로그인</h2>

                        <p>
                            시스템을 이용하려면 로그인해주세요.
                        </p>
                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* 아이디 */}
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

                        {/* 비밀번호 */}
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

                        {/* 오류 */}
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        {/* 로그인 버튼 */}
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

                </div>

                {/* 하단 */}
                <div className="login-footer">
          <span>
            Equipment Management System
          </span>
                </div>

            </div>

        </div>
    );
}

export default Login;