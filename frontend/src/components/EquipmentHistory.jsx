import { useEffect, useState } from "react";
import { getEquipmentHistory } from "../api/equipmentHistoryApi";

function EquipmentHistory({ equipmentId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!equipmentId) return;

    getEquipmentHistory(equipmentId)
      .then(setHistory)
      .catch((error) => {
        console.error("장비 상태 이력 조회 실패", error);
        setHistory([]);
      });
  }, [equipmentId]);

  if (history.length === 0) {
    return <p>상태 변경 이력이 없습니다.</p>;
  }

  return (
    <div className="equipment-history">
      <h3>상태 변경 이력</h3>
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
              <td>{item.previousStatusCodeId}</td>
              <td>{item.newStatusCodeId}</td>
              <td>{item.changedBy}</td>
              <td>{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EquipmentHistory;
