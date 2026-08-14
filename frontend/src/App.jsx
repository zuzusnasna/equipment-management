import { useEffect, useState } from "react";
import {
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  checkEquipmentDuplicate,
} from "./api/equipmentApi";
import "./App.css";

// ========================================
// 상태 코드 → 상태명
// ========================================

const getStatusName = (statusCodeId) => {
  switch (Number(statusCodeId)) {
    case 1:
      return "정상";
    case 2:
      return "오류";
    case 3:
      return "중지";
    default:
      return "알 수 없음";
  }
};

// ========================================
// 카테고리명
// ========================================

function CategoryName({ categoryId }) {
  switch (Number(categoryId)) {
    case 1:
      return "생산장비";
    case 2:
      return "가공장비";
    case 3:
      return "검사장비";
    default:
      return "알 수 없음";
  }
}

// ========================================
// 대시보드 카드
// ========================================

function DashboardCard({ title, value, icon }) {
  return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
        <span className="dashboard-card-title">
          {title}
        </span>

          <span className="dashboard-card-icon">
          {icon}
        </span>
        </div>

        <div className="dashboard-card-value">
          {value}
        </div>
      </div>
  );
}

// ========================================
// 상태 뱃지
// ========================================

function StatusBadge({ status }) {
  return (
      <span
          className={`status-badge ${
              status === "정상"
                  ? "status-normal"
                  : status === "오류"
                      ? "status-broken"
                      : status === "중지"
                          ? "status-inspection"
                          : "status-default"
          }`}
      >
      {status}
    </span>
  );
}

// ========================================
// App
// ========================================

function App({ user, onLogout }) {
  // ========================================
  // 로그인 상태
  // ========================================



  // ========================================
  // 장비 목록
  // ========================================

  const [equipments, setEquipments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // 등록 / 수정 form
  // ========================================

  const [form, setForm] = useState({
    eqNo: "",
    name: "",
    categoryId: "",
    statusCodeId: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ========================================
  // 장비번호 중복확인
  // ========================================

  const [duplicateChecked, setDuplicateChecked] =
      useState(false);

  const [duplicateResult, setDuplicateResult] =
      useState(null);

  // ========================================
  // 검색 / 필터
  // ========================================

  const [searchKeyword, setSearchKeyword] =
      useState("");

  const [selectedStatus, setSelectedStatus] =
      useState("");

  const [selectedFactory, setSelectedFactory] =
      useState("");

  // ========================================
  // 상세 모달
  // ========================================

  const [selectedEquipment, setSelectedEquipment] =
      useState(null);

  // ========================================
  // 장비 목록 조회
  // ========================================

  const loadEquipments = async () => {
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
          "장비 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 최초 장비 조회
  //
  // 중요:
  // useEffect 안에서 setState를 직접 실행하지 않고
  // 비동기 함수 내부에서 처리
  // ========================================

  useEffect(() => {
    let cancelled = false;

    getEquipments()
        .then((data) => {
          if (cancelled) {
            return;
          }

          setEquipments(
              Array.isArray(data) ? data : []
          );
        })
        .catch((err) => {
          console.error(err);

          if (!cancelled) {
            setError(
                "장비 목록을 불러오는데 실패했습니다."
            );
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });

    return () => {
      cancelled = true;
    };
  }, []);

  // ========================================
  // 입력값 변경
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 장비번호가 변경되면
    // 기존 중복확인은 무효화
    if (name === "eqNo") {
      setDuplicateChecked(false);
      setDuplicateResult(null);
    }
  };

  // ========================================
  // 장비번호 중복확인
  // ========================================

  const handleCheckDuplicate = async () => {
    if (editingId !== null) {
      return;
    }

    if (!form.eqNo.trim()) {
      alert("장비 번호를 입력해주세요.");
      return;
    }

    try {
      const exists =
          await checkEquipmentDuplicate(
              form.eqNo.trim()
          );

      console.log(
          "장비번호 중복확인 결과:",
          exists
      );

      setDuplicateChecked(true);
      setDuplicateResult(exists);

      if (exists) {
        alert(
            "이미 사용 중인 장비 번호입니다."
        );
      } else {
        alert(
            "사용 가능한 장비 번호입니다."
        );
      }
    } catch (err) {
      console.error(err);

      setDuplicateChecked(false);
      setDuplicateResult(null);

      alert(
          "장비번호 중복 확인에 실패했습니다."
      );
    }
  };

  // ========================================
  // 등록 / 수정
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수값 검사
    if (
        !form.eqNo.trim() ||
        !form.name.trim() ||
        !form.categoryId ||
        !form.statusCodeId ||
        !form.location.trim()
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 신규 등록이면 중복확인 필수
    if (editingId === null) {
      if (!duplicateChecked) {
        alert(
            "장비번호 중복확인을 해주세요."
        );
        return;
      }

      if (duplicateResult === true) {
        alert(
            "이미 등록된 장비번호입니다."
        );
        return;
      }
    }

    const requestData = {
      eqNo: form.eqNo.trim(),
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      statusCodeId: Number(form.statusCodeId),
      location: form.location.trim(),
    };

    console.log(
        "장비 등록/수정 요청:",
        requestData
    );

    try {
      if (editingId !== null) {
        await updateEquipment(
            editingId,
            requestData
        );

        alert("장비가 수정되었습니다.");
      } else {
        await createEquipment(
            requestData
        );

        alert("장비가 등록되었습니다.");
      }

      // form 초기화
      setForm({
        eqNo: "",
        name: "",
        categoryId: "",
        statusCodeId: "",
        location: "",
      });

      setEditingId(null);

      setDuplicateChecked(false);
      setDuplicateResult(null);

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

  // ========================================
  // 수정
  // ========================================

  const handleEdit = (equipment) => {
    setEditingId(equipment.id);

    setForm({
      eqNo: equipment.eqNo || "",
      name: equipment.name || "",
      categoryId:
          equipment.categoryId
              ? String(equipment.categoryId)
              : "",
      statusCodeId:
          equipment.statusCodeId
              ? String(equipment.statusCodeId)
              : "",
      location: equipment.location || "",
    });

    // 수정 모드에서는
    // 중복확인 필요 없음
    setDuplicateChecked(true);
    setDuplicateResult(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // 수정 취소
  // ========================================

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      eqNo: "",
      name: "",
      categoryId: "",
      statusCodeId: "",
      location: "",
    });

    setDuplicateChecked(false);
    setDuplicateResult(null);
  };

  // ========================================
  // 삭제
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "정말 이 장비를 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEquipment(id);

      alert("장비가 삭제되었습니다.");

      if (selectedEquipment?.id === id) {
        setSelectedEquipment(null);
      }

      await loadEquipments();
    } catch (err) {
      console.error(err);

      alert(
          "장비 삭제에 실패했습니다."
      );
    }
  };

  // ========================================
  // 장비 상세 보기
  // ========================================

  const handleEquipmentDetail = (
      equipment
  ) => {
    setSelectedEquipment(equipment);
  };



  // ========================================
  // 대시보드 통계
  // ========================================

  const totalCount = equipments.length;

  const normalCount =
      equipments.filter(
          (equipment) =>
              Number(equipment.statusCodeId) === 1
      ).length;

  const errorCount =
      equipments.filter(
          (equipment) =>
              Number(equipment.statusCodeId) === 2
      ).length;

  const stoppedCount =
      equipments.filter(
          (equipment) =>
              Number(equipment.statusCodeId) === 3
      ).length;

  // ========================================
  // 공장별 장비 수
  // ========================================

  const factoryCounts =
      equipments.reduce(
          (acc, equipment) => {
            const factory =
                equipment.location;

            if (!factory) {
              return acc;
            }

            acc[factory] =
                (acc[factory] || 0) + 1;

            return acc;
          },
          {}
      );

  // ========================================
  // 검색 / 필터
  // ========================================

  const filteredEquipments =
      equipments.filter(
          (equipment) => {
            const keyword =
                searchKeyword
                    .trim()
                    .toLowerCase();

            const matchesKeyword =
                !keyword ||
                equipment.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                equipment.eqNo
                    ?.toLowerCase()
                    .includes(keyword) ||
                equipment.location
                    ?.toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                !selectedStatus ||
                Number(
                    equipment.statusCodeId
                ) === Number(selectedStatus);

            const matchesFactory =
                !selectedFactory ||
                equipment.location ===
                selectedFactory;

            return (
                matchesKeyword &&
                matchesStatus &&
                matchesFactory
            );
          }
      );



  // ========================================
  // 메인 화면
  // ========================================

  return(<div className="app">

    {/* ========================================
    헤더
  ======================================== */}

    <header className="app-header">

      <div>
        <h1 className="app-title">
          장비 관리 시스템
        </h1>

        <p className="app-subtitle">
          장비 등록, 조회, 수정 및 삭제를
          관리합니다.
        </p>
      </div>

      {/* 로그인 사용자 / 로그아웃 */}

      <div className="header-user">

      <span>
        {user?.name ||
            user?.loginId ||
            "사용자"}{" "}
        님
      </span>

        <button
            type="button"
            className="logout-button"
            onClick={onLogout}
        >
          로그아웃
        </button>

      </div>

    </header>

    {/* ========================================
    대시보드
  ======================================== */}

    <section className="section">

      <h2 className="section-title">
        대시보드
      </h2>

      <div className="dashboard-grid">

        <DashboardCard
            title="전체 장비"
            value={totalCount}
            icon="📦"
        />

        <DashboardCard
            title="정상"
            value={normalCount}
            icon="✅"
        />

        <DashboardCard
            title="오류"
            value={errorCount}
            icon="⚠️"
        />

        <DashboardCard
            title="중지"
            value={stoppedCount}
            icon="⛔"
        />

      </div>

    </section>

    {/* ========================================
    공장별 현황
  ======================================== */}

    <section className="section">

      <div className="section-header">

        <div>

          <h2 className="section-title">
            공장별 현황
          </h2>

          <p className="section-description">
            공장을 클릭하면 해당 공장의
            장비를 확인할 수 있습니다.
          </p>

        </div>

        {selectedFactory && <button
                type="button"
                className="outline-button"
                onClick={() =>
                    setSelectedFactory("")
                }
            >
              전체 공장 보기
            </button>}

      </div>

      {Object.keys(factoryCounts).length ===
      0 ? <div className="empty-card">
            등록된 공장이 없습니다.
          </div> : <div className="factory-grid">

            {Object.entries(
                factoryCounts
            ).map(
                ([factory, count]) => {

                  const isSelected =
                      selectedFactory ===
                      factory;

                  const factoryEquipments =
                      equipments.filter(
                          (equipment) =>
                              equipment.location ===
                              factory
                      );

                  const factoryNormalCount =
                      factoryEquipments.filter(
                          (equipment) =>
                              Number(
                                  equipment.statusCodeId
                              ) === 1
                      ).length;

                  const factoryErrorCount =
                      factoryEquipments.filter(
                          (equipment) =>
                              Number(
                                  equipment.statusCodeId
                              ) === 2
                      ).length;

                  const factoryStoppedCount =
                      factoryEquipments.filter(
                          (equipment) =>
                              Number(
                                  equipment.statusCodeId
                              ) === 3
                      ).length;

                  return (
                      <button
                          key={factory}
                          type="button"
                          className={`factory-card ${
                              isSelected
                                  ? "factory-card-selected"
                                  : ""
                          }`}
                          onClick={() => {
                            setSelectedFactory(
                                isSelected
                                    ? ""
                                    : factory
                            );
                          }}
                      >

                        {isSelected && (
                            <div className="selected-badge">
                              선택됨
                            </div>
                        )}

                        <div className="factory-icon">
                          🏭
                        </div>

                        <div className="factory-label">
                          Factory
                        </div>

                        <div className="factory-name">
                          {factory}
                        </div>

                        <div className="factory-total">

                  <span className="factory-total-label">
                    전체 장비
                  </span>

                          <div>
                            {count}

                            <span className="factory-unit">
                      대
                    </span>
                          </div>

                        </div>

                        <div className="factory-status-grid">

                          <div className="factory-status normal">

                    <span>
                      정상
                    </span>

                            <strong>
                              {factoryNormalCount}
                            </strong>

                          </div>

                          <div className="factory-status inspection">

                    <span>
                      오류
                    </span>

                            <strong>
                              {factoryErrorCount}
                            </strong>

                          </div>

                          <div className="factory-status broken">

                    <span>
                      중지
                    </span>

                            <strong>
                              {factoryStoppedCount}
                            </strong>

                          </div>

                        </div>

                        <div className="factory-card-footer">

                          {isSelected
                              ? "클릭하여 선택 해제"
                              : "클릭하여 장비 보기 →"}

                        </div>

                      </button>
                  );
                }
            )}

          </div>}

      {selectedFactory && <div className="factory-filter-info">

            <div>

          <span className="filter-icon">
            🔎
          </span>

              현재{" "}
              <strong>
                {selectedFactory}
              </strong>{" "}
              장비를 보고 있습니다.

            </div>

            <button
                type="button"
                className="filter-clear-button"
                onClick={() =>
                    setSelectedFactory("")
                }
            >
              필터 해제
            </button>

          </div>}

    </section>

    {/* ========================================
    장비 등록 / 수정
  ======================================== */}

    <section className="form-card">

      <div className="form-header">

        <h2 className="section-title">

          {editingId !== null
              ? "장비 수정"
              : "장비 등록"}

        </h2>

        {editingId !== null && <span className="edit-badge">
          수정 모드
        </span>}

      </div>

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          {/* 장비 번호 */}

          <div className="form-group">

            <label>
              장비 번호
            </label>

            <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
            >

              <input
                  type="text"
                  name="eqNo"
                  value={form.eqNo}
                  onChange={handleChange}
                  placeholder="예: EQ-003"
                  style={{
                    flex: 1,
                  }}
              />

              {editingId === null && <button
                      type="button"
                      className="secondary-button"
                      onClick={
                        handleCheckDuplicate
                      }
                  >
                    중복확인
                  </button>}

            </div>

            {editingId === null &&
                duplicateChecked &&
                duplicateResult === false && <div
                        style={{
                          marginTop: "6px",
                          color: "green",
                          fontSize: "14px",
                        }}
                    >
                      ✓ 사용 가능한 장비번호입니다.
                    </div>}

            {editingId === null &&
                duplicateChecked &&
                duplicateResult === true && <div
                        style={{
                          marginTop: "6px",
                          color: "red",
                          fontSize: "14px",
                        }}
                    >
                      ✕ 이미 사용 중인 장비번호입니다.
                    </div>}

          </div>

          {/* 장비명 */}

          <div className="form-group">

            <label>
              장비명
            </label>

            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="장비명을 입력하세요"
            />

          </div>

          {/* 카테고리 */}

          <div className="form-group">

            <label>
              장비 카테고리
            </label>

            <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
            >

              <option value="">
                카테고리 선택
              </option>

              <option value="1">
                생산장비
              </option>

              <option value="2">
                가공장비
              </option>

              <option value="3">
                검사장비
              </option>

            </select>

          </div>

          {/* 상태 */}

          <div className="form-group">

            <label>
              상태
            </label>

            <select
                name="statusCodeId"
                value={form.statusCodeId}
                onChange={handleChange}
            >

              <option value="">
                상태 선택
              </option>

              <option value="1">
                정상
              </option>

              <option value="2">
                오류
              </option>

              <option value="3">
                중지
              </option>

            </select>

          </div>

          {/* 위치 */}

          <div className="form-group">

            <label>
              위치
            </label>

            <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="예: A동 1층"
            />

          </div>

        </div>

        {/* 등록 / 수정 버튼 */}

        <div className="form-actions">

          <button
              type="submit"
              className="primary-button"
          >
            {editingId !== null
                ? "수정하기"
                : "등록하기"}
          </button>

          {editingId !== null && <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
              >
                취소
              </button>}

        </div>

      </form>

    </section>

    {/* ========================================
    장비 목록
  ======================================== */}

    <section className="section equipment-section">

      <div className="section-header">

        <div>

          <h2 className="section-title">
            장비 목록
          </h2>

          <p className="section-description">
            장비명, 장비 번호 또는 위치로
            검색할 수 있습니다.
          </p>

        </div>

        {selectedFactory && <span className="selected-factory-text">
          {selectedFactory}
        </span>}

      </div>

      {/* 검색 */}

      <div className="search-card">

        <div className="search-header">

          <div>

            <h3>
              장비 검색
            </h3>

            <p>
              장비명, 장비 번호 또는 위치로
              검색할 수 있습니다.
            </p>

          </div>

          <span className="result-count">

          검색 결과{" "}

            <strong>
            {filteredEquipments.length}
          </strong>

          건

        </span>

        </div>

        <div className="search-row">

          <div className="search-input-wrapper">

          <span className="search-icon">
            🔍
          </span>

            <input
                type="text"
                value={searchKeyword}
                onChange={(e) =>
                    setSearchKeyword(
                        e.target.value
                    )
                }
                placeholder="장비명, 장비 번호, 위치 검색"
            />

          </div>

          <select
              value={selectedStatus}
              onChange={(e) =>
                  setSelectedStatus(
                      e.target.value
                  )
              }
          >

            <option value="">
              전체 상태
            </option>

            <option value="1">
              정상
            </option>

            <option value="2">
              오류
            </option>

            <option value="3">
              중지
            </option>

          </select>

          <button
              type="button"
              className="reset-button"
              onClick={() => {
                setSearchKeyword("");
                setSelectedStatus("");
                setSelectedFactory("");
              }}
          >
            초기화
          </button>

        </div>

        {(searchKeyword ||
            selectedStatus ||
            selectedFactory) && <div className="active-filters">

          <span>
            현재 필터:
          </span>

              {searchKeyword && (
                  <span className="filter-badge">
              검색: {searchKeyword}
            </span>
              )}

              {selectedStatus && (
                  <span className="filter-badge">
              상태:{" "}
                    {getStatusName(
                        selectedStatus
                    )}
            </span>
              )}

              {selectedFactory && (
                  <span className="filter-badge">
              공장: {selectedFactory}
            </span>
              )}

            </div>}

      </div>

      {/* 로딩 */}

      {loading && <div className="empty-card">
            장비 목록을 불러오는 중입니다...
          </div>}

      {/* 에러 */}

      {error && <div className="error-card">
            {error}
          </div>}

      {/* 결과 없음 */}

      {!loading &&
          !error &&
          filteredEquipments.length === 0 && <div className="empty-card">

                {equipments.length === 0
                    ? "등록된 장비가 없습니다."
                    : "검색 조건에 맞는 장비가 없습니다."}

              </div>}

      {/* 테이블 */}

      {!loading &&
          !error &&
          filteredEquipments.length > 0 && <div className="table-wrapper">

                <table>

                  <thead>

                  <tr>

                    <th>ID</th>
                    <th>장비 번호</th>
                    <th>장비명</th>
                    <th>카테고리</th>
                    <th>상태</th>
                    <th>위치</th>
                    <th>관리</th>

                  </tr>

                  </thead>

                  <tbody>

                  {filteredEquipments.map(
                      (equipment) => (

                          <tr
                              key={equipment.id}
                          >

                            <td>
                              {equipment.id}
                            </td>

                            <td>
                              {equipment.eqNo}
                            </td>

                            <td className="equipment-name">

                              <button
                                  type="button"
                                  className="equipment-name-button"
                                  onClick={() =>
                                      handleEquipmentDetail(
                                          equipment
                                      )
                                  }
                              >
                                {equipment.name}
                              </button>

                            </td>

                            <td>

                              <CategoryName
                                  categoryId={
                                    equipment.categoryId
                                  }
                              />

                            </td>

                            <td>

                              <StatusBadge
                                  status={getStatusName(
                                      equipment.statusCodeId
                                  )}
                              />

                            </td>

                            <td>
                              {equipment.location}
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

              </div>}

      {!loading &&
          !error &&
          equipments.length > 0 && <div className="table-footer">

                총{" "}

                <strong>
                  {filteredEquipments.length}
                </strong>

                개 표시

              </div>}

    </section>

        {/* ========================================
    장비 상세 모달
    ======================================== */}

        {selectedEquipment && (
            <div
                className="modal-overlay"
                onClick={() => setSelectedEquipment(null)}
            >

              <div
                  className="equipment-modal"
                  onClick={(e) => e.stopPropagation()}
              >

                <div className="modal-header">

                  <div>

              <span className="modal-label">
                EQUIPMENT DETAIL
              </span>

                    <h2>
                      장비 상세 정보
                    </h2>

                  </div>

                  <button
                      type="button"
                      className="modal-close"
                      onClick={() => setSelectedEquipment(null)}
                  >
                    ×
                  </button>

                </div>

                <div className="modal-equipment-title">

                  <div className="modal-equipment-icon">
                    ⚙️
                  </div>

                  <div>

                    <h3>
                      {selectedEquipment.name}
                    </h3>

                    <p>
                      {selectedEquipment.eqNo}
                    </p>

                  </div>

                </div>

                <div className="detail-list">

                  <div className="detail-row">

              <span>
                ID
              </span>

                    <strong>
                      {selectedEquipment.id}
                    </strong>

                  </div>

                  <div className="detail-row">

              <span>
                장비 번호
              </span>

                    <strong>
                      {selectedEquipment.eqNo}
                    </strong>

                  </div>

                  <div className="detail-row">

              <span>
                장비명
              </span>

                    <strong>
                      {selectedEquipment.name}
                    </strong>

                  </div>

                  <div className="detail-row">

              <span>
                카테고리
              </span>

                    <strong>
                      <CategoryName
                          categoryId={selectedEquipment.categoryId}
                      />
                    </strong>

                  </div>

                  <div className="detail-row">

              <span>
                상태
              </span>

                    <StatusBadge
                        status={getStatusName(
                            selectedEquipment.statusCodeId
                        )}
                    />

                  </div>

                  <div className="detail-row">

              <span>
                위치
              </span>

                    <strong>
                      {selectedEquipment.location}
                    </strong>

                  </div>

                </div>

                <div className="modal-actions">

                  <button
                      type="button"
                      className="modal-edit-button"
                      onClick={() => {
                        handleEdit(selectedEquipment);
                        setSelectedEquipment(null);
                      }}
                  >
                    수정하기
                  </button>

                  <button
                      type="button"
                      className="modal-close-button"
                      onClick={() => setSelectedEquipment(null)}
                  >
                    닫기
                  </button>

                </div>

              </div>

            </div>
        )}

      </div>
  );
}

export default App;