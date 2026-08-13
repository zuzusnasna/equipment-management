import { useEffect, useState } from "react";
import {
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "./api/equipmentApi";
import "./App.css";

function App() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    status: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  // 검색 / 필터
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFactory, setSelectedFactory] = useState("");

  // 장비 상세 모달
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // ========================================
  // 장비 목록 조회
  // ========================================
  const loadEquipments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEquipments();

      setEquipments(data);
    } catch (err) {
      console.error(err);
      setError("장비 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 최초 조회
  // ========================================
  useEffect(() => {
    let mounted = true;

    const fetchEquipments = async () => {
      try {
        const data = await getEquipments();

        if (mounted) {
          setEquipments(data);
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError("장비 목록을 불러오는데 실패했습니다.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEquipments();

    return () => {
      mounted = false;
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
  };

  // ========================================
  // 등록 / 수정
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !form.name ||
        !form.type ||
        !form.status ||
        !form.location
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateEquipment(editingId, form);
        alert("장비가 수정되었습니다.");
      } else {
        await createEquipment(form);
        alert("장비가 등록되었습니다.");
      }

      setForm({
        name: "",
        type: "",
        status: "",
        location: "",
      });

      setEditingId(null);

      await loadEquipments();
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // ========================================
  // 수정
  // ========================================
  const handleEdit = (equipment) => {
    setEditingId(equipment.id);

    setForm({
      name: equipment.name || "",
      type: equipment.type || "",
      status: equipment.status || "",
      location: equipment.location || "",
    });

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
      name: "",
      type: "",
      status: "",
      location: "",
    });
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

      // 현재 보고 있던 상세 모달이 삭제된 장비라면 닫기
      if (selectedEquipment?.id === id) {
        setSelectedEquipment(null);
      }

      await loadEquipments();
    } catch (err) {
      console.error(err);
      alert("장비 삭제에 실패했습니다.");
    }
  };

  // ========================================
  // 장비 상세 보기
  // ========================================
  const handleEquipmentDetail = (equipment) => {
    setSelectedEquipment(equipment);
  };

  // ========================================
  // 대시보드 통계
  // ========================================
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

  // ========================================
  // 공장별 장비 수
  // ========================================
  const factoryCounts = equipments.reduce(
      (acc, equipment) => {
        const factory = equipment.location;

        if (!factory) {
          return acc;
        }

        acc[factory] = (acc[factory] || 0) + 1;

        return acc;
      },
      {}
  );

  // ========================================
  // 검색 / 필터
  // ========================================
  const filteredEquipments = equipments.filter(
      (equipment) => {
        const keyword = searchKeyword
            .trim()
            .toLowerCase();

        const matchesKeyword =
            !keyword ||
            equipment.name
                ?.toLowerCase()
                .includes(keyword) ||
            equipment.type
                ?.toLowerCase()
                .includes(keyword) ||
            equipment.location
                ?.toLowerCase()
                .includes(keyword);

        const matchesStatus =
            !selectedStatus ||
            equipment.status === selectedStatus;

        const matchesFactory =
            !selectedFactory ||
            equipment.location === selectedFactory;

        return (
            matchesKeyword &&
            matchesStatus &&
            matchesFactory
        );
      }
  );

  return (
      <div className="app">
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
                title="점검중"
                value={inspectionCount}
                icon="🔧"
            />

            <DashboardCard
                title="고장"
                value={brokenCount}
                icon="⚠️"
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
                공장을 클릭하면 해당 공장의 장비를
                확인할 수 있습니다.
              </p>
            </div>

            {selectedFactory && (
                <button
                    type="button"
                    className="outline-button"
                    onClick={() =>
                        setSelectedFactory("")
                    }
                >
                  전체 공장 보기
                </button>
            )}
          </div>

          {Object.keys(factoryCounts).length === 0 ? (
              <div className="empty-card">
                등록된 공장이 없습니다.
              </div>
          ) : (
              <div className="factory-grid">
                {Object.entries(factoryCounts).map(
                    ([factory, count]) => {
                      const isSelected =
                          selectedFactory === factory;

                      const factoryEquipments =
                          equipments.filter(
                              (equipment) =>
                                  equipment.location === factory
                          );

                      const factoryNormalCount =
                          factoryEquipments.filter(
                              (equipment) =>
                                  equipment.status === "정상"
                          ).length;

                      const factoryInspectionCount =
                          factoryEquipments.filter(
                              (equipment) =>
                                  equipment.status === "점검중"
                          ).length;

                      const factoryBrokenCount =
                          factoryEquipments.filter(
                              (equipment) =>
                                  equipment.status === "고장"
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
                                    isSelected ? "" : factory
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
                                <span>정상</span>
                                <strong>
                                  {factoryNormalCount}
                                </strong>
                              </div>

                              <div className="factory-status inspection">
                                <span>점검</span>
                                <strong>
                                  {factoryInspectionCount}
                                </strong>
                              </div>

                              <div className="factory-status broken">
                                <span>고장</span>
                                <strong>
                                  {factoryBrokenCount}
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
              </div>
          )}

          {selectedFactory && (
              <div className="factory-filter-info">
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
              </div>
          )}
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

            {editingId !== null && (
                <span className="edit-badge">
              수정 모드
            </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>장비명</label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="장비명을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>장비 유형</label>

                <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="예: Bonder"
                />
              </div>

              <div className="form-group">
                <label>상태</label>

                <select
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

              <div className="form-group">
                <label>위치</label>

                <input
                    type="text"
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
                      onClick={handleCancel}
                  >
                    취소
                  </button>
              )}
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
                장비명, 유형 또는 위치로 검색할 수
                있습니다.
              </p>
            </div>

            {selectedFactory && (
                <span className="selected-factory-text">
              {selectedFactory}
            </span>
            )}
          </div>

          {/* 검색 */}
          <div className="search-card">
            <div className="search-header">
              <div>
                <h3>장비 검색</h3>

                <p>
                  장비명, 유형 또는 위치로
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
                        setSearchKeyword(e.target.value)
                    }
                    placeholder="장비명, 유형, 위치 검색"
                />
              </div>

              <select
                  value={selectedStatus}
                  onChange={(e) =>
                      setSelectedStatus(e.target.value)
                  }
              >
                <option value="">
                  전체 상태
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
                selectedFactory) && (
                <div className="active-filters">
                  <span>현재 필터:</span>

                  {searchKeyword && (
                      <span className="filter-badge">
                  검색: {searchKeyword}
                </span>
                  )}

                  {selectedStatus && (
                      <span className="filter-badge">
                  상태: {selectedStatus}
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

          {/* 로딩 */}
          {loading && (
              <div className="empty-card">
                장비 목록을 불러오는 중입니다...
              </div>
          )}

          {/* 에러 */}
          {error && (
              <div className="error-card">
                {error}
              </div>
          )}

          {/* 결과 없음 */}
          {!loading &&
              !error &&
              filteredEquipments.length === 0 && (
                  <div className="empty-card">
                    {equipments.length === 0
                        ? "등록된 장비가 없습니다."
                        : "검색 조건에 맞는 장비가 없습니다."}
                  </div>
              )}

          {/* 테이블 */}
          {!loading &&
              !error &&
              filteredEquipments.length > 0 && (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                      <tr>
                        <th>ID</th>
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

                                {/* 장비명 클릭 */}
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
                                  {equipment.type}
                                </td>

                                <td>
                                  <StatusBadge
                                      status={
                                        equipment.status
                                      }
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
                  </div>
              )}

          {!loading &&
              !error &&
              equipments.length > 0 && (
                  <div className="table-footer">
                    총{" "}
                    <strong>
                      {filteredEquipments.length}
                    </strong>
                    개 표시
                  </div>
              )}
        </section>

        {/* ========================================
          장비 상세 모달
      ======================================== */}
        {selectedEquipment && (
            <div
                className="modal-overlay"
                onClick={() =>
                    setSelectedEquipment(null)
                }
            >
              <div
                  className="equipment-modal"
                  onClick={(e) =>
                      e.stopPropagation()
                  }
              >
                <div className="modal-header">
                  <div>
                <span className="modal-label">
                  EQUIPMENT DETAIL
                </span>

                    <h2>장비 상세 정보</h2>
                  </div>

                  <button
                      type="button"
                      className="modal-close"
                      onClick={() =>
                          setSelectedEquipment(null)
                      }
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
                      {selectedEquipment.type}
                    </p>
                  </div>
                </div>

                <div className="detail-list">
                  <div className="detail-row">
                    <span>ID</span>

                    <strong>
                      {selectedEquipment.id}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>장비명</span>

                    <strong>
                      {selectedEquipment.name}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>장비 유형</span>

                    <strong>
                      {selectedEquipment.type}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>상태</span>

                    <StatusBadge
                        status={
                          selectedEquipment.status
                        }
                    />
                  </div>

                  <div className="detail-row">
                    <span>위치</span>

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
                        handleEdit(
                            selectedEquipment
                        );
                        setSelectedEquipment(null);
                      }}
                  >
                    수정하기
                  </button>

                  <button
                      type="button"
                      className="modal-close-button"
                      onClick={() =>
                          setSelectedEquipment(null)
                      }
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

// ========================================
// 대시보드 카드
// ========================================

function DashboardCard({
                         title,
                         value,
                         icon,
                       }) {
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
                  : status === "점검중"
                      ? "status-inspection"
                      : status === "고장"
                          ? "status-broken"
                          : "status-default"
          }`}
      >
      {status}
    </span>
  );
}

export default App;