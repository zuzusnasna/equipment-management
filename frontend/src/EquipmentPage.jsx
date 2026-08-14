import { useEffect, useState } from "react";
import {
    getEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    checkEquipmentDuplicate,
} from "./api/equipmentApi";

function EquipmentPage({ user, onLogout }) {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        eqNo: "",
        name: "",
        type: "",
        status: "",
        location: "",
    });

    // 중복확인 상태
    const [duplicateChecked, setDuplicateChecked] = useState(false);
    const [duplicateResult, setDuplicateResult] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("전체");
    const [selectedFactory, setSelectedFactory] = useState(null);

    // =========================
    // 장비 조회
    // =========================

    const loadEquipments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getEquipments();

            setEquipments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("장비 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getEquipments();

                setEquipments(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(err);
                setError(
                    "장비 목록을 불러오지 못했습니다."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // =========================
    // 입력값 변경
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // 장비번호가 변경되면 중복확인 다시 해야 함
        if (name === "eqNo") {
            setDuplicateChecked(false);
            setDuplicateResult(null);
        }
    };

    // =========================
    // 폼 초기화
    // =========================

    const resetForm = () => {
        setForm({
            eqNo: "",
            name: "",
            type: "",
            status: "",
            location: "",
        });

        setEditingId(null);

        setDuplicateChecked(false);
        setDuplicateResult(null);
    };

    // =========================
    // 장비번호 중복확인
    // =========================

    const handleCheckDuplicate = async () => {
        if (!form.eqNo.trim()) {
            alert("장비 번호를 입력해주세요.");
            return;
        }

        try {
            console.log("중복확인 시작:", form.eqNo);

            const exists = await checkEquipmentDuplicate(form.eqNo);

            console.log("중복확인 결과:", exists);

            setDuplicateChecked(true);
            setDuplicateResult(exists);

            if (exists === true) {
                alert("이미 사용 중인 장비 번호입니다.");
            } else {
                alert("사용 가능한 장비 번호입니다.");
            }
        } catch (err) {
            console.error("중복확인 오류:", err);

            setDuplicateChecked(false);
            setDuplicateResult(null);

            alert("중복 확인에 실패했습니다.");
        }
    };
    // =========================
    // 등록 / 수정
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.eqNo.trim() ||
            !form.name.trim() ||
            !form.type.trim() ||
            !form.status ||
            !form.location.trim()
        ) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        // 신규 등록일 때만 중복확인 필수
        if (editingId === null) {
            if (!duplicateChecked) {
                alert("장비번호 중복확인을 해주세요.");
                return;
            }

            if (duplicateResult === true) {
                alert("이미 등록된 장비번호입니다.");
                return;
            }
        }

        try {
            if (editingId !== null) {
                await updateEquipment(editingId, form);
                alert("장비가 수정되었습니다.");
            } else {
                await createEquipment(form);
                alert("장비가 등록되었습니다.");
            }

            resetForm();
            await loadEquipments();
        } catch (err) {
            console.error(err);

            alert(
                editingId !== null
                    ? "장비 수정에 실패했습니다."
                    : "장비 등록에 실패했습니다."
            );
        }
    };

    // =========================
    // 수정
    // =========================

    const handleEdit = (equipment) => {
        setEditingId(equipment.id);

        setForm({
            eqNo: equipment.eqNo || "",
            name: equipment.name || "",
            type: equipment.type || "",
            status: equipment.status || "",
            location: equipment.location || "",
        });

        // 수정 모드에서는 중복확인 필요 없음
        setDuplicateChecked(true);
        setDuplicateResult(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // 삭제
    // =========================

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        try {
            await deleteEquipment(id);

            alert("장비가 삭제되었습니다.");

            if (editingId === id) {
                resetForm();
            }

            await loadEquipments();
        } catch (err) {
            console.error(err);
            alert("장비 삭제에 실패했습니다.");
        }
    };

    // =========================
    // 공장 필터
    // =========================

    const clearFactoryFilter = () => {
        setSelectedFactory(null);
    };

    // =========================
    // 상태 CSS
    // =========================

    const getStatusClass = (status) => {
        if (status === "정상") {
            return "status-normal";
        }

        if (status === "점검중") {
            return "status-inspection";
        }

        if (status === "고장") {
            return "status-broken";
        }

        return "status-default";
    };

    const getFactoryName = (location) => {
        if (!location) {
            return "미지정";
        }

        return location;
    };

    // =========================
    // 검색
    // =========================

    const filteredEquipments = equipments.filter((equipment) => {
        const keyword = searchKeyword.trim().toLowerCase();

        const matchesKeyword =
            keyword === "" ||
            (equipment.eqNo || "").toLowerCase().includes(keyword) ||
            (equipment.name || "").toLowerCase().includes(keyword) ||
            (equipment.type || "").toLowerCase().includes(keyword) ||
            (equipment.location || "").toLowerCase().includes(keyword);

        const matchesType =
            searchType === "전체" ||
            equipment.type === searchType;

        const matchesFactory =
            selectedFactory === null ||
            getFactoryName(equipment.location) === selectedFactory;

        return (
            matchesKeyword &&
            matchesType &&
            matchesFactory
        );
    });

    // =========================
    // 통계
    // =========================

    const totalCount = equipments.length;

    const normalCount = equipments.filter(
        (equipment) => equipment.status === "정상"
    ).length;

    const inspectionCount = equipments.filter(
        (equipment) => equipment.status === "점검중"
    ).length;

    const brokenCount = equipments.filter(
        (equipment) => equipment.status === "고장"
    ).length;

    // =========================
    // 공장 통계
    // =========================

    const factoryNames = [
        ...new Set(
            equipments
                .map((equipment) => equipment.location)
                .filter(Boolean)
        ),
    ];

    const factoryStats = factoryNames.map((factory) => {
        const factoryEquipments = equipments.filter(
            (equipment) => equipment.location === factory
        );

        return {
            name: factory,
            total: factoryEquipments.length,
            normal: factoryEquipments.filter(
                (equipment) => equipment.status === "정상"
            ).length,
            inspection: factoryEquipments.filter(
                (equipment) => equipment.status === "점검중"
            ).length,
            broken: factoryEquipments.filter(
                (equipment) => equipment.status === "고장"
            ).length,
        };
    });

    // =========================
    // 장비 유형
    // =========================

    const equipmentTypes = [
        "전체",
        ...new Set(
            equipments
                .map((equipment) => equipment.type)
                .filter(Boolean)
        ),
    ];

    return (
        <div className="app">

            {/* =========================
                헤더
            ========================= */}

            <header className="app-header">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "20px",
                    }}
                >
                    <div>
                        <h1 className="app-title">
                            장비 관리 시스템
                        </h1>

                        <p className="app-subtitle">
                            장비 현황을 확인하고 등록 및 수정할 수 있습니다.
                            <br />
                            {user?.name || "사용자"}님 환영합니다.
                            {user?.role && ` · ${user.role}`}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onLogout}
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            {/* =========================
                에러
            ========================= */}

            {error && (
                <div className="error-card">
                    {error}
                </div>
            )}

            {/* =========================
                전체 현황
            ========================= */}

            <section className="section">

                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            장비 현황
                        </h2>

                        <p className="section-description">
                            현재 등록된 장비의 전체 현황입니다.
                        </p>
                    </div>
                </div>

                <div className="dashboard-grid">

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-title">
                                전체 장비
                            </span>

                            <span className="dashboard-card-icon">
                                🖥️
                            </span>
                        </div>

                        <div className="dashboard-card-value">
                            {totalCount}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-title">
                                정상
                            </span>

                            <span className="dashboard-card-icon">
                                🟢
                            </span>
                        </div>

                        <div className="dashboard-card-value">
                            {normalCount}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-title">
                                점검중
                            </span>

                            <span className="dashboard-card-icon">
                                🟡
                            </span>
                        </div>

                        <div className="dashboard-card-value">
                            {inspectionCount}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-title">
                                고장
                            </span>

                            <span className="dashboard-card-icon">
                                🔴
                            </span>
                        </div>

                        <div className="dashboard-card-value">
                            {brokenCount}
                        </div>
                    </div>

                </div>
            </section>

            {/* =========================
                공장별 현황
            ========================= */}

            <section className="section">

                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            공장별 현황
                        </h2>

                        <p className="section-description">
                            공장을 선택하면 해당 공장의 장비만 조회됩니다.
                        </p>
                    </div>
                </div>

                {factoryStats.length === 0 ? (
                    <div className="empty-card">
                        등록된 공장 정보가 없습니다.
                    </div>
                ) : (
                    <div className="factory-grid">

                        {factoryStats.map((factory) => {
                            const selected =
                                selectedFactory === factory.name;

                            return (
                                <button
                                    type="button"
                                    key={factory.name}
                                    className={`factory-card ${
                                        selected
                                            ? "factory-card-selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedFactory(
                                            selected
                                                ? null
                                                : factory.name
                                        )
                                    }
                                >
                                    {selected && (
                                        <span className="selected-badge">
                                            선택됨
                                        </span>
                                    )}

                                    <div className="factory-icon">
                                        🏭
                                    </div>

                                    <div className="factory-label">
                                        공장
                                    </div>

                                    <div className="factory-name">
                                        {factory.name}
                                    </div>

                                    <div className="factory-total">
                                        <span className="factory-total-label">
                                            전체 장비
                                        </span>

                                        {factory.total}
                                        <span className="factory-unit">
                                            대
                                        </span>
                                    </div>

                                    <div className="factory-status-grid">

                                        <div className="factory-status normal">
                                            <span>정상</span>
                                            <strong>
                                                {factory.normal}
                                            </strong>
                                        </div>

                                        <div className="factory-status inspection">
                                            <span>점검</span>
                                            <strong>
                                                {factory.inspection}
                                            </strong>
                                        </div>

                                        <div className="factory-status broken">
                                            <span>고장</span>
                                            <strong>
                                                {factory.broken}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="factory-card-footer">
                                        클릭하여 장비 조회
                                    </div>
                                </button>
                            );
                        })}

                    </div>
                )}

                {selectedFactory && (
                    <div className="factory-filter-info">

                        <div>
                            <span className="filter-icon">
                                🔎
                            </span>

                            현재
                            <strong>
                                {" "}{selectedFactory}{" "}
                            </strong>
                            장비만 표시 중입니다.
                        </div>

                        <button
                            type="button"
                            className="filter-clear-button"
                            onClick={clearFactoryFilter}
                        >
                            필터 해제
                        </button>

                    </div>
                )}

            </section>

            {/* =========================
                장비 등록 / 수정
            ========================= */}

            <section className="form-card">

                <div className="form-header">

                    <div>
                        <h2 className="section-title">
                            {editingId !== null
                                ? "장비 수정"
                                : "장비 등록"}
                        </h2>

                        <p className="section-description">
                            {editingId !== null
                                ? "등록된 장비 정보를 수정합니다."
                                : "새로운 장비를 등록합니다."}
                        </p>
                    </div>

                    {editingId !== null && (
                        <span className="edit-badge">
                            수정 모드
                        </span>
                    )}

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        {/* 장비 번호 */}
                        <div className="form-group">
                            <label htmlFor="eqNo">
                                장비 번호
                            </label>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                    width: "100%"
                                }}
                            >
                                <input
                                    id="eqNo"
                                    name="eqNo"
                                    value={form.eqNo}
                                    onChange={handleChange}
                                    placeholder="예: EQ-001"
                                    style={{
                                        flex: 1
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleCheckDuplicate}
                                    style={{
                                        display: "block",
                                        padding: "10px 16px",
                                        backgroundColor: "#333",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    중복확인
                                </button>
                            </div>
                            {duplicateChecked && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        fontSize: "14px",
                                        color: duplicateResult ? "#dc2626" : "#16a34a",
                                    }}
                                >
                                    {duplicateResult
                                        ? "❌ 이미 사용 중인 장비 번호입니다."
                                        : "✅ 사용 가능한 장비 번호입니다."}
                                </div>
                            )}
                        </div>

                        {/* 장비명 */}
                        <div className="form-group">
                            <label htmlFor="name">
                                장비명
                            </label>

                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="예: TC Bonder"
                            />
                        </div>

                        {/* 유형 */}
                        <div className="form-group">
                            <label htmlFor="type">
                                장비 유형
                            </label>

                            <input
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                placeholder="예: Bonder"
                            />
                        </div>

                        {/* 상태 */}
                        <div className="form-group">
                            <label htmlFor="status">
                                상태
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="">
                                    상태 선택
                                </option>

                                <option value="정상">
                                    정상
                                </option>

                                <option value="점검중">
                                    점검중
                                </option>

                                <option value="고장">
                                    고장
                                </option>
                            </select>
                        </div>

                        {/* 위치 */}
                        <div className="form-group">
                            <label htmlFor="location">
                                위치 / 공장
                            </label>

                            <input
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="예: 1공장"
                            />
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingId !== null
                                ? "수정하기"
                                : "등록하기"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                취소
                            </button>
                        )}

                    </div>

                </form>
            </section>

            {/* =========================
                장비 검색 / 목록
            ========================= */}

            <section className="equipment-section">

                <div className="section-header">

                    <div>
                        <h2 className="section-title">
                            장비 목록
                        </h2>

                        <p className="section-description">
                            등록된 장비를 검색하고 관리합니다.
                        </p>
                    </div>

                    {selectedFactory && (
                        <span className="selected-factory-text">
                            {selectedFactory}
                        </span>
                    )}

                </div>

                <div className="search-card">

                    <div className="search-header">

                        <div>
                            <h3>
                                장비 검색
                            </h3>

                            <p>
                                장비번호, 장비명, 유형, 위치로 검색할 수 있습니다.
                            </p>
                        </div>

                        <div className="result-count">
                            검색 결과{" "}
                            <strong>
                                {filteredEquipments.length}
                            </strong>
                            건
                        </div>

                    </div>

                    <div className="search-row">

                        <div className="search-input-wrapper">

                            <span className="search-icon">
                                🔍
                            </span>

                            <input
                                value={searchKeyword}
                                onChange={(e) =>
                                    setSearchKeyword(e.target.value)
                                }
                                placeholder="장비번호, 장비명, 유형, 위치 검색"
                            />

                        </div>

                        <select
                            value={searchType}
                            onChange={(e) =>
                                setSearchType(e.target.value)
                            }
                        >
                            {equipmentTypes.map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type === "전체"
                                        ? "전체 유형"
                                        : type}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            className="reset-button"
                            onClick={() => {
                                setSearchKeyword("");
                                setSearchType("전체");
                                setSelectedFactory(null);
                            }}
                        >
                            초기화
                        </button>

                    </div>

                    {(searchKeyword ||
                        searchType !== "전체" ||
                        selectedFactory) && (
                        <div className="active-filters">

                            <span>
                                적용된 필터:
                            </span>

                            {searchKeyword && (
                                <span className="filter-badge">
                                    검색: {searchKeyword}
                                </span>
                            )}

                            {searchType !== "전체" && (
                                <span className="filter-badge">
                                    유형: {searchType}
                                </span>
                            )}

                            {selectedFactory && (
                                <span className="filter-badge">
                                    공장: {selectedFactory}
                                </span>
                            )}

                        </div>
                    )}

                </div>

                {loading ? (
                    <div className="empty-card">
                        장비 목록을 불러오는 중입니다...
                    </div>
                ) : filteredEquipments.length === 0 ? (
                    <div className="empty-card">
                        검색 조건에 해당하는 장비가 없습니다.
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">

                            <table>

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>장비번호</th>
                                    <th>장비명</th>
                                    <th>유형</th>
                                    <th>상태</th>
                                    <th>위치</th>
                                    <th>관리</th>
                                </tr>
                                </thead>

                                <tbody>

                                {filteredEquipments.map(
                                    (equipment) => (
                                        <tr key={equipment.id}>

                                            <td>
                                                {equipment.id}
                                            </td>

                                            <td>
                                                {equipment.eqNo}
                                            </td>

                                            <td className="equipment-name">
                                                {equipment.name}
                                            </td>

                                            <td>
                                                {equipment.type || "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        equipment.status
                                                    )}`}
                                                >
                                                    {equipment.status ||
                                                        "미정"}
                                                </span>
                                            </td>

                                            <td>
                                                {equipment.location ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <div className="table-actions">

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                equipment
                                                            )
                                                        }
                                                    >
                                                        수정
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                equipment.id
                                                            )
                                                        }
                                                    >
                                                        삭제
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                        <div className="table-footer">
                            총{" "}
                            <strong>
                                {filteredEquipments.length}
                            </strong>
                            개의 장비
                        </div>
                    </>
                )}

            </section>

        </div>
    );
}

export default EquipmentPage;