import { useEffect, useState } from "react";
import { getEquipmentHistory } from "../api/equipmentApi";

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

/**
 * 장비 상세 화면에서 상태 변경 이력을 보여주는 컴포넌트입니다.
 *
 * 이력 조회는 장비 ID를 기준으로 서버에서 가져오며,
 * 최신 변경 이력이 먼저 표시되도록 구성합니다.
 */
export default function EquipmentHistoryPanel({ equipmentId }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!equipmentId) {
            return;
        }

        let cancelled = false;

        setLoading(true);
        setError("");

        getEquipmentHistory(equipmentId)
            .then((data) => {
                if (!cancelled) {
                    setHistory(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                console.error(err);

                if (!cancelled) {
                    setError("상태 변경 이력을 불러오지 못했습니다.");
                    setHistory([]);
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
    }, [equipmentId]);

    return (
        <section className="equipment-history">
            <div className="equipment-history-header">
                <h3>상태 변경 이력</h3>
                <span>{history.length}건</span>
            </div>

            {loading && (
                <div className="history-empty">이력을 불러오는 중입니다...</div>
            )}

            {error && (
                <div className="history-error">{error}</div>
            )}

            {!loading && !error && history.length === 0 && (
                <div className="history-empty">
                    아직 상태 변경 이력이 없습니다.
                </div>
            )}

            {!loading && !error && history.length > 0 && (
                <div className="history-list">
                    {history.map((item) => (
                        <article className="history-item" key={item.id}>
                            <div className="history-item-top">
                                <strong>
                                    {getStatusName(item.previousStatusCodeId)}
                                    <span className="history-arrow">→</span>
                                    {getStatusName(item.newStatusCodeId)}
                                </strong>
                                <time>
                                    {item.changedAt
                                        ? new Date(item.changedAt).toLocaleString("ko-KR")
                                        : "-"}
                                </time>
                            </div>

                            <p className="history-comment">
                                {item.comment}
                            </p>

                            <div className="history-user">
                                변경자: {item.changedBy}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
