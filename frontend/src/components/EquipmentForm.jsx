const API_BASE_URL = "http://localhost:8080";

// 장비 전체 조회
export async function getEquipments() {
    const response = await fetch(`${API_BASE_URL}/equipments`);

    if (!response.ok) {
        throw new Error("장비 목록 조회 실패");
    }

    return await response.json();
}

// 장비 단건 조회
export async function getEquipment(id) {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`);

    if (!response.ok) {
        throw new Error("장비 조회 실패");
    }

    return await response.json();
}

// 장비 등록
export async function createEquipment(equipment) {
    const response = await fetch(`${API_BASE_URL}/equipments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(equipment),
    });

    if (!response.ok) {
        throw new Error("장비 등록 실패");
    }

    return await response.json();
}

// 장비 수정
export async function updateEquipment(id, equipment) {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(equipment),
    });

    if (!response.ok) {
        throw new Error("장비 수정 실패");
    }

    return await response.json();
}

// 장비 삭제
export async function deleteEquipment(id) {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("장비 삭제 실패");
    }

    return true;
}