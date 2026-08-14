const API_BASE_URL = "http://localhost:8080";

// ========================================
// 장비 전체 조회
// ========================================

export async function getEquipments() {
    const response = await fetch(
        `${API_BASE_URL}/equipments`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            `장비 조회 실패: ${response.status}`
        );
    }

    return response.json();
}

// ========================================
// 장비 단건 조회
// ========================================

export async function getEquipment(id) {
    const response = await fetch(
        `${API_BASE_URL}/equipments/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            `장비 조회 실패: ${response.status}`
        );
    }

    return response.json();
}

// ========================================
// 장비 번호 중복 확인
// ========================================

export async function checkEquipmentDuplicate(eqNo) {
    console.log("중복확인 요청:", eqNo);

    const response = await fetch(
        `${API_BASE_URL}/equipments/check-duplicate?eqNo=${encodeURIComponent(eqNo)}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    console.log("중복확인 응답 상태:", response.status);

    if (!response.ok) {
        const text = await response.text();
        console.error("중복확인 실패:", text);

        throw new Error(
            `중복 확인 실패: ${response.status}`
        );
    }

    const result = await response.json();

    console.log("중복확인 결과:", result);

    return result;
}

// ========================================
// 장비 등록
// ========================================

export async function createEquipment(data) {
    console.log("POST /equipments 요청 데이터:", data);

    const response = await fetch(
        `${API_BASE_URL}/equipments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const responseText = await response.text();

    console.log(
        "POST /equipments 응답 상태:",
        response.status
    );

    console.log(
        "POST /equipments 응답 내용:",
        responseText
    );

    if (!response.ok) {
        throw new Error(
            `장비 등록 실패: ${response.status} / ${responseText}`
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

// ========================================
// 장비 수정
// ========================================

export async function updateEquipment(id, data) {
    const response = await fetch(
        `${API_BASE_URL}/equipments/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `장비 수정 실패: ${response.status} / ${responseText}`
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

// ========================================
// 장비 삭제
// ========================================

export async function deleteEquipment(id) {
    const response = await fetch(
        `${API_BASE_URL}/equipments/${id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            `장비 삭제 실패: ${response.status}`
        );
    }

    return true;
}