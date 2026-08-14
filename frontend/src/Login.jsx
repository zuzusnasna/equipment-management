import { useState } from "react";
import { login } from "./api/authApi";

function Login({ onLogin }) {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginId || !password) {
            setError("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const user = await login(loginId, password);

            onLogin(user);
        } catch (err) {
            console.error(err);
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <div className="login-icon">
                        ⚙️
                    </div>

                    <h1>장비 관리 시스템</h1>

                    <p>
                        관리자 계정으로 로그인해주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="login-form-group">
                        <label>아이디</label>

                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) =>
                                setLoginId(e.target.value)
                            }
                            placeholder="아이디를 입력하세요"
                        />
                    </div>

                    <div className="login-form-group">
                        <label>비밀번호</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="비밀번호를 입력하세요"
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

            </div>
        </div>
    );
}

export default Login;