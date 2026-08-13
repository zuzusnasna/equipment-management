const API_BASE_URL = "http://localhost:8080";

export const getEquipments = async () => {
    const response = await fetch(`${API_BASE_URL}/equipments`);

    if (!response.ok) {
        throw new Error("장비 목록 조회 실패");
    }

    return response.json();
};

export const createEquipment = async (equipment) => {
    const response = await fetch(`${API_BASE_URL}/equipments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(equipment),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("등록 실패:", response.status, errorText);
        throw new Error("장비 등록 실패");
    }

    return response.json();
};

export const updateEquipment = async (id, equipment) => {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(equipment),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("수정 실패:", response.status, errorText);
        throw new Error("장비 수정 실패");
    }

    return response.json();
};

export const deleteEquipment = async (id) => {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            "삭제 실패:",
            response.status,
            errorText
        );

        throw new Error("장비 삭제 실패");
    }

    // DELETE 성공 후 응답 body가 없는 경우
    return true;
};