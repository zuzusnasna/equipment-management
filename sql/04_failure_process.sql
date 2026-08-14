-- ========================================
-- 04. 장애 처리 프로세스
-- ========================================


-- ========================================
-- 1. 장애 상태 : 접수 → 배정
-- ========================================

INSERT INTO STATUS_HISTORY (
    failure_id,
    from_status_code_id,
    to_status_code_id,
    changed_by,
    changed_at
)
VALUES (
           1,
           8,
           9,
           2,
           SYSTIMESTAMP
       );


UPDATE FAILURE
SET status_code_id = 9,
    updated_at = SYSTIMESTAMP
WHERE failure_id = 1;


-- ========================================
-- 2. 장애 상태 : 배정 → 처리중
-- ========================================

INSERT INTO STATUS_HISTORY (
    failure_id,
    from_status_code_id,
    to_status_code_id,
    changed_by,
    changed_at
)
VALUES (
           1,
           9,
           10,
           3,
           SYSTIMESTAMP
       );


UPDATE FAILURE
SET status_code_id = 10,
    updated_at = SYSTIMESTAMP
WHERE failure_id = 1;


-- ========================================
-- 3. 장애 조치 시작
-- ========================================

INSERT INTO FAILURE_ACTION (
    assign_id,
    cause,
    action,
    result,
    started_at,
    finished_at
)
VALUES (
           1,
           '냉각팬 베어링 마모로 인해 장비 작동 중 비정상 진동이 발생함.',
           '냉각팬 베어링 및 팬 어셈블리를 교체하고 장비를 재가동함.',
           '재가동 후 진동이 정상 범위로 감소했으며 장비가 정상 작동함.',
           SYSTIMESTAMP,
           NULL
       );


-- ========================================
-- 4. 조치 완료
-- ========================================

UPDATE FAILURE_ACTION
SET finished_at = SYSTIMESTAMP,
    updated_at = SYSTIMESTAMP
WHERE action_id = 1;


-- 장애 상태 : 처리중 → 처리완료

UPDATE FAILURE
SET status_code_id = 11,
    updated_at = SYSTIMESTAMP
WHERE failure_id = 1;


INSERT INTO STATUS_HISTORY (
    failure_id,
    from_status_code_id,
    to_status_code_id,
    changed_by,
    changed_at
)
VALUES (
           1,
           10,
           11,
           3,
           SYSTIMESTAMP
       );


-- ========================================
-- 5. 최종 완료
-- ========================================

UPDATE FAILURE
SET status_code_id = 12,
    updated_at = SYSTIMESTAMP
WHERE failure_id = 1;


INSERT INTO STATUS_HISTORY (
    failure_id,
    from_status_code_id,
    to_status_code_id,
    changed_by,
    changed_at
)
VALUES (
           1,
           11,
           12,
           2,
           SYSTIMESTAMP
       );


COMMIT;