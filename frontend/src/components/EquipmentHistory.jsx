import { useEffect, useState } from "react";
import { getEquipmentHistory } from "../api/equipmentHistoryApi";
import "./EquipmentHistory.css";

// 상태 코드 ID를 화면에서 이해하기 쉬운 상태명으로 변환합니다.
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

function EquipmentHistory({ equipmentId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!equipmentId) {
      return;
    }

    getEquipmentHistory(equipmentId)
      .then(setHistory)
      .catch((error) => {
        console.error("장비 상태 이력 조회 실패", error);
        setHistory([]);
      });
  }, [equipmentId]);

  if (history.length === 0) {
    return (
      <div className="equipment-history">
        <h3>상태 변경 이력</h3>
        <p>상태 변경 이력이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="equipment-history">
      <h3>상태 변경 이력</h3>

      <div className="equipment-history-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>변경일시</th>
              <th>이전 상태</th>
              <th>변경 상태</th>
              <th>변경자</th>
              <th>변경 사유</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.changedAt?.replace("T", " ")}</td>
                <td>{getStatusName(item.previousStatusCodeId)}</td>
                <td>{getStatusName(item.newStatusCodeId)}</td>
                <td>{item.changedBy}</td>
                <td>{item.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentHistory;
