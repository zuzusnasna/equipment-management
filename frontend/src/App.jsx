import { useEffect, useState } from "react";
import {
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  checkEquipmentDuplicate,
} from "./api/equipmentApi";
import EquipmentHistory from "./components/EquipmentHistory";
import "./App.css";

// 상태 코드 ID를 화면에 표시할 상태명으로 변환합니다.
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

function DashboardCard({ title, value, icon }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <span className="dashboard-card-title">{title}</span>
        <span className="dashboard-card-icon">{icon}</span>
      </div>
      <div className="dashboard-card-value">{value}</div>
    </div>
  );
}

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

function App({ user, onLogout }) {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    eqNo: "",
    name: "",
    categoryId: "",
    statusCodeId: "",
    location: "",
    comment: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingOriginalStatusId, setEditingOriginalStatusId] = useState(null);

  const [duplicateChecked, setDuplicateChecked] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const loadEquipments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEquipments();
      setEquipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("장비 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getEquipments()
      .then((data) => {
        if (!cancelled) {
          setEquipments(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setError("장비 목록을 불러오는데 실패했습니다.");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "eqNo") {
      setDuplicateChecked(false);
      setDuplicateResult(null);
    }
  };

  const handleCheckDuplicate = async () => {
    if (editingId !== null) return;

    if (!form.eqNo.trim()) {
      alert("장비 번호를 입력해주세요.");
      return;
    }

    try {
      const exists = await checkEquipmentDuplicate(form.eqNo.trim());
      setDuplicateChecked(true);
      setDuplicateResult(exists);
      alert(exists ? "이미 사용 중인 장비 번호입니다." : "사용 가능한 장비 번호입니다.");
    } catch (err) {
      console.error(err);
      setDuplicateChecked(false);
      setDuplicateResult(null);
      alert("장비번호 중복 확인에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // 장비 수정 시에는 변경 사유를 항상 입력하도록 합니다.
    if (editingId !== null && !form.comment.trim()) {
      alert("장비를 수정하려면 변경 사유를 입력해주세요.");
      return;
    }

    const requestData = {
      eqNo: form.eqNo.trim(),
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      statusCodeId: Number(form.statusCodeId),
      location: form.location.trim(),
    };

    // 변경 사유는 수정 요청에만 전달합니다.
    if (editingId !== null) {
      requestData.comment = form.comment.trim();
    }

    try {
      if (editingId !== null) {
        await updateEquipment(editingId, requestData);
        alert("장비가 수정되었습니다.");
      } else {
        await createEquipment(requestData);
        alert("장비가 등록되었습니다.");
      }

      setForm({
        eqNo: "",
        name: "",
        categoryId: "",
        statusCodeId: "",
        location: "",
        comment: "",
      });
      setEditingId(null);
      setEditingOriginalStatusId(null);
      setDuplicateChecked(false);
      setDuplicateResult(null);

      await loadEquipments();
    } catch (err) {
      console.error(err);
      alert(editingId !== null ? "장비 수정에 실패했습니다." : "장비 등록에 실패했습니다.");
    }
  };

  const handleEdit = (equipment) => {
    setEditingId(equipment.id);
    setEditingOriginalStatusId(equipment.statusCodeId);

    setForm({
      eqNo: equipment.eqNo || "",
      name: equipment.name || "",
      categoryId: equipment.categoryId ? String(equipment.categoryId) : "",
      statusCodeId: equipment.statusCodeId ? String(equipment.statusCodeId) : "",
      location: equipment.location || "",
      comment: "",
    });

    setDuplicateChecked(true);
    setDuplicateResult(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingOriginalStatusId(null);
    setForm({
      eqNo: "",
      name: "",
      categoryId: "",
      statusCodeId: "",
      location: "",
      comment: "",
    });
    setDuplicateChecked(false);
    setDuplicateResult(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 장비를 삭제하시겠습니까?")) return;

    try {
      await deleteEquipment(id);
      alert("장비가 삭제되었습니다.");

      if (selectedEquipment?.id === id) {
        setSelectedEquipment(null);
      }

      await loadEquipments();
    } catch (err) {
      console.error(err);
      alert("장비 삭제에 실패했습니다.");
    }
  };

  const totalCount = equipments.length;
  const normalCount = equipments.filter((e) => Number(e.statusCodeId) === 1).length;
  const errorCount = equipments.filter((e) => Number(e.statusCodeId) === 2).length;
  const stoppedCount = equipments.filter((e) => Number(e.statusCodeId) === 3).length;

  const factoryCounts = equipments.reduce((acc, equipment) => {
    const factory = equipment.location;
    if (factory) {
      acc[factory] = (acc[factory] || 0) + 1;
    }
    return acc;
  }, {});

  const filteredEquipments = equipments.filter((equipment) => {
    const keyword = searchKeyword.trim().toLowerCase();
    const matchesKeyword =
      !keyword ||
      equipment.name?.toLowerCase().includes(keyword) ||
      equipment.eqNo?.toLowerCase().includes(keyword) ||
      equipment.location?.toLowerCase().includes(keyword);

    const matchesStatus =
      !selectedStatus || Number(equipment.statusCodeId) === Number(selectedStatus);
    const matchesFactory = !selectedFactory || equipment.location === selectedFactory;

    return matchesKeyword && matchesStatus && matchesFactory;
  });

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">장비 관리 시스템</h1>
          <p className="app-subtitle">장비 등록, 조회, 수정 및 삭제를 관리합니다.</p>
        </div>

        <div className="header-user">
          <span>{user?.name || user?.loginId || "사용자"} 님</span>
          <button type="button" className="logout-button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <section className="section">
        <h2 className="section-title">대시보드</h2>
        <div className="dashboard-grid">
          <DashboardCard title="전체 장비" value={totalCount} icon="📦" />
          <DashboardCard title="정상" value={normalCount} icon="✅" />
          <DashboardCard title="오류" value={errorCount} icon="⚠️" />
          <DashboardCard title="중지" value={stoppedCount} icon="⛔" />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">공장별 현황</h2>
            <p className="section-description">공장을 클릭하면 해당 공장의 장비를 확인할 수 있습니다.</p>
          </div>
          {selectedFactory && (
            <button type="button" className="outline-button" onClick={() => setSelectedFactory("")}>
              전체 공장 보기
            </button>
          )}
        </div>

        {Object.keys(factoryCounts).length === 0 ? (
          <div className="empty-card">등록된 공장이 없습니다.</div>
        ) : (
          <div className="factory-grid">
            {Object.entries(factoryCounts).map(([factory, count]) => {
              const isSelected = selectedFactory === factory;
              const factoryEquipments = equipments.filter((e) => e.location === factory);
              const factoryNormalCount = factoryEquipments.filter((e) => Number(e.statusCodeId) === 1).length;
              const factoryErrorCount = factoryEquipments.filter((e) => Number(e.statusCodeId) === 2).length;
              const factoryStoppedCount = factoryEquipments.filter((e) => Number(e.statusCodeId) === 3).length;

              return (
                <button
                  key={factory}
                  type="button"
                  className={`factory-card ${isSelected ? "factory-card-selected" : ""}`}
                  onClick={() => setSelectedFactory(isSelected ? "" : factory)}
                >
                  {isSelected && <div className="selected-badge">선택됨</div>}
                  <div className="factory-icon">🏭</div>
                  <div className="factory-label">Factory</div>
                  <div className="factory-name">{factory}</div>
                  <div className="factory-total">
                    <span className="factory-total-label">전체 장비</span>
                    <div>{count}<span className="factory-unit">대</span></div>
                  </div>
                  <div className="factory-status-grid">
                    <div className="factory-status normal"><span>정상</span><strong>{factoryNormalCount}</strong></div>
                    <div className="factory-status inspection"><span>오류</span><strong>{factoryErrorCount}</strong></div>
                    <div className="factory-status broken"><span>중지</span><strong>{factoryStoppedCount}</strong></div>
                  </div>
                  <div className="factory-card-footer">
                    {isSelected ? "클릭하여 선택 해제" : "클릭하여 장비 보기 →"}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedFactory && (
          <div className="factory-filter-info">
            <div><span className="filter-icon">🔎</span> 현재 <strong>{selectedFactory}</strong> 장비를 보고 있습니다.</div>
            <button type="button" className="filter-clear-button" onClick={() => setSelectedFactory("")}>필터 해제</button>
          </div>
        )}
      </section>

      <section className="form-card">
        <div className="form-header">
          <h2 className="section-title">{editingId !== null ? "장비 수정" : "장비 등록"}</h2>
          {editingId !== null && <span className="edit-badge">수정 모드</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>장비 번호</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" name="eqNo" value={form.eqNo} onChange={handleChange} placeholder="예: EQ-003" style={{ flex: 1 }} />
                {editingId === null && (
                  <button type="button" className="secondary-button" onClick={handleCheckDuplicate}>중복확인</button>
                )}
              </div>
              {editingId === null && duplicateChecked && duplicateResult === false && (
                <div style={{ marginTop: "6px", color: "green", fontSize: "14px" }}>✓ 사용 가능한 장비번호입니다.</div>
              )}
              {editingId === null && duplicateChecked && duplicateResult === true && (
                <div style={{ marginTop: "6px", color: "red", fontSize: "14px" }}>✕ 이미 사용 중인 장비번호입니다.</div>
              )}
            </div>

            <div className="form-group">
              <label>장비명</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="장비명을 입력하세요" />
            </div>

            <div className="form-group">
              <label>장비 카테고리</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                <option value="">카테고리 선택</option>
                <option value="1">생산장비</option>
                <option value="2">가공장비</option>
                <option value="3">검사장비</option>
              </select>
            </div>

            <div className="form-group">
              <label>상태</label>
              <select name="statusCodeId" value={form.statusCodeId} onChange={handleChange}>
                <option value="">상태 선택</option>
                <option value="1">정상</option>
                <option value="2">오류</option>
                <option value="3">중지</option>
              </select>
            </div>

            <div className="form-group">
              <label>위치</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="예: A동 1층" />
            </div>

            {editingId !== null && (
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>
                  변경 사유 <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="장비 수정 사유를 입력하세요."
                  rows="3"
                />
                <p style={{ marginTop: "6px", color: "#666", fontSize: "13px" }}>
                  장비 수정 시 변경 사유가 필수입니다.
                </p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId !== null ? "수정하기" : "등록하기"}
            </button>
            {editingId !== null && (
              <button type="button" className="secondary-button" onClick={handleCancel}>취소</button>
            )}
          </div>
        </form>
      </section>

      <section className="section equipment-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">장비 목록</h2>
            <p className="section-description">장비명, 장비 번호 또는 위치로 검색할 수 있습니다.</p>
          </div>
          {selectedFactory && <span className="selected-factory-text">{selectedFactory}</span>}
        </div>

        <div className="search-card">
          <div className="search-header">
            <div>
              <h3>장비 검색</h3>
              <p>장비명, 장비 번호 또는 위치로 검색할 수 있습니다.</p>
            </div>
            <span className="result-count">검색 결과 <strong>{filteredEquipments.length}</strong>건</span>
          </div>

          <div className="search-row">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="장비명, 장비 번호, 위치 검색" />
            </div>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="">전체 상태</option>
              <option value="1">정상</option>
              <option value="2">오류</option>
              <option value="3">중지</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-card">장비 정보를 불러오는 중입니다...</div>
        ) : error ? (
          <div className="error-card">{error}</div>
        ) : filteredEquipments.length === 0 ? (
          <div className="empty-card">검색 조건에 맞는 장비가 없습니다.</div>
        ) : (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>장비 번호</th>
                  <th>장비명</th>
                  <th>카테고리</th>
                  <th>상태</th>
                  <th>위치</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments.map((equipment) => (
                  <tr key={equipment.id}>
                    <td>{equipment.eqNo}</td>
                    <td>{equipment.name}</td>
                    <td><CategoryName categoryId={equipment.categoryId} /></td>
                    <td><StatusBadge status={getStatusName(equipment.statusCodeId)} /></td>
                    <td>{equipment.location}</td>
                    <td>
                      <button type="button" className="table-button" onClick={() => handleEdit(equipment)}>수정</button>
                      <button type="button" className="table-button danger" onClick={() => handleDelete(equipment.id)}>삭제</button>
                      <button type="button" className="table-button" onClick={() => setSelectedEquipment(equipment)}>상세</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedEquipment && (
        <div className="modal-backdrop" onClick={() => setSelectedEquipment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedEquipment.name}</h2>
                <p>{selectedEquipment.eqNo}</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedEquipment(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>장비 번호</strong><span>{selectedEquipment.eqNo}</span></div>
                <div><strong>장비명</strong><span>{selectedEquipment.name}</span></div>
                <div><strong>카테고리</strong><span><CategoryName categoryId={selectedEquipment.categoryId} /></span></div>
                <div><strong>상태</strong><span><StatusBadge status={getStatusName(selectedEquipment.statusCodeId)} /></span></div>
                <div><strong>위치</strong><span>{selectedEquipment.location}</span></div>
              </div>

              <EquipmentHistory equipmentId={selectedEquipment.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
