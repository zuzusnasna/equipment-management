const API_BASE_URL = "http://localhost:8080";

export async function login(loginId, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            loginId,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("로그인에 실패했습니다.");
    }

    return response.json();
}

export async function getMe() {
    const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("로그인 정보가 없습니다.");
    }

    return response.json();
}

export async function logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("로그아웃에 실패했습니다.");
    }
}