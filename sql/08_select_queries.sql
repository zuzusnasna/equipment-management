-- ========================================
-- 08. 조회 쿼리
-- ========================================


-- ----------------------------------------
-- 1. 장비 목록
-- ----------------------------------------

SELECT
    e.equipment_id,
    e.eq_no,
    e.name AS equipment_name,
    e.location,
    c.name AS category_name,
    cc.name AS status,
    e.use_yn,
    e.created_at
FROM EQUIPMENT e
         JOIN EQUIPMENT_CATEGORY c
              ON e.category_id = c.category_id
         JOIN COMMON_CODE cc
              ON e.status_code_id = cc.code_id
ORDER BY e.equipment_id;


-- ----------------------------------------
-- 2. 특정 장비 조회
-- ----------------------------------------

SELECT
    e.equipment_id,
    e.eq_no,
    e.name AS equipment_name,
    e.location,
    c.name AS category_name,
    cc.name AS status
FROM EQUIPMENT e
         JOIN EQUIPMENT_CATEGORY c
              ON e.category_id = c.category_id
         JOIN COMMON_CODE cc
              ON e.status_code_id = cc.code_id
WHERE e.equipment_id = 1;


-- ----------------------------------------
-- 3. 장애 조치 결과 조회
-- ----------------------------------------

SELECT
    fa.action_id,
    f.failure_id,
    u.name AS engineer,
    fa.cause,
    fa.action,
    fa.result,
    fa.started_at,
    fa.finished_at
FROM FAILURE_ACTION fa
         JOIN ASSIGNMENT a
              ON fa.assign_id = a.assign_id
         JOIN FAILURE f
              ON a.failure_id = f.failure_id
         JOIN USERS u
              ON a.engineer_id = u.user_id
WHERE fa.action_id = (
    SELECT MAX(action_id)
    FROM FAILURE_ACTION
);


-- ----------------------------------------
-- 4. 장애 상세 조회
-- ----------------------------------------

SELECT
    f.failure_id,
    e.eq_no,
    e.name AS equipment_name,
    eng.name AS engineer,
    fa.cause,
    fa.action,
    fa.result,
    fa.started_at,
    fa.finished_at,
    cc.name AS status
FROM FAILURE f
         JOIN EQUIPMENT e
              ON f.equipment_id = e.equipment_id
         JOIN ASSIGNMENT a
              ON f.failure_id = a.failure_id
         JOIN USERS eng
              ON a.engineer_id = eng.user_id
         JOIN FAILURE_ACTION fa
              ON a.assign_id = fa.assign_id
         JOIN COMMON_CODE cc
              ON f.status_code_id = cc.code_id
WHERE f.failure_id = 1;


-- ----------------------------------------
-- 5. 현재 장애 상태 조회
-- ----------------------------------------

SELECT
    f.failure_id,
    e.eq_no,
    e.name AS equipment_name,
    cc.name AS current_status
FROM FAILURE f
         JOIN EQUIPMENT e
              ON f.equipment_id = e.equipment_id
         JOIN COMMON_CODE cc
              ON f.status_code_id = cc.code_id
WHERE f.failure_id = 1;


-- ----------------------------------------
-- 6. 장애 상태 변경 이력
-- ----------------------------------------

SELECT
    sh.history_id,
    from_cc.name AS from_status,
    to_cc.name AS to_status,
    u.name AS changed_by,
    sh.changed_at
FROM STATUS_HISTORY sh
         LEFT JOIN COMMON_CODE from_cc
                   ON sh.from_status_code_id = from_cc.code_id
         JOIN COMMON_CODE to_cc
              ON sh.to_status_code_id = to_cc.code_id
         JOIN USERS u
              ON sh.changed_by = u.user_id
WHERE sh.failure_id = 1
ORDER BY sh.history_id;


-- ----------------------------------------
-- 7. 담당 엔지니어 장비 조회
-- ----------------------------------------

SELECT
    em.manager_id,
    e.eq_no,
    e.name AS equipment_name,
    u.name AS engineer,
    em.assigned_at,
    em.ended_at,
    em.use_yn
FROM EQUIPMENT_MANAGER em
         JOIN EQUIPMENT e
              ON em.equipment_id = e.equipment_id
         JOIN USERS u
              ON em.engineer_id = u.user_id
WHERE em.use_yn = 'Y';


-- ----------------------------------------
-- 8. 장애 검토 결과 조회
-- ----------------------------------------

SELECT
    fr.review_id,
    fr.failure_id,
    u.name AS reviewer,
    fr.review_result,
    fr.review_comment,
    fr.reviewed_at
FROM FAILURE_REVIEW fr
         JOIN USERS u
              ON fr.reviewer_id = u.user_id
ORDER BY fr.reviewed_at DESC;


-- ----------------------------------------
-- 9. 감사 로그 조회
-- ----------------------------------------

SELECT
    al.audit_id,
    u.name AS user_name,
    al.action_type,
    al.table_name,
    al.record_id,
    al.action_detail,
    al.created_at
FROM AUDIT_LOG al
         LEFT JOIN USERS u
                   ON al.user_id = u.user_id
ORDER BY al.created_at DESC;