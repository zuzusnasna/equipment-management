-- ========================================
-- 03. 테스트 데이터 입력
-- ========================================


-- ========================================
-- 장비 1
-- ========================================

INSERT INTO EQUIPMENT (
    company_id,
    category_id,
    eq_no,
    name,
    type,
    status,
    location,
    status_code_id,
    use_yn
)
VALUES (
           1,
           2,
           'EQ-001',
           '자동 가공 장비',
           '가공장비',
           '정상',
           'A동 1층',
           1,
           'Y'
       );


-- ========================================
-- 장비 2
-- ========================================

INSERT INTO EQUIPMENT (
    company_id,
    category_id,
    eq_no,
    name,
    type,
    status,
    location,
    status_code_id,
    use_yn
)
VALUES (
           1,
           3,
           'EQ-002',
           '품질 검사 장비',
           '검사장비',
           '정상',
           'A동 2층',
           1,
           'Y'
       );


-- ========================================
-- 장애 접수
-- ========================================

INSERT INTO FAILURE (
    equipment_id,
    reporter_id,
    type_code_id,
    content,
    occurred_at,
    status_code_id
)
VALUES (
           1,
           3,
           4,
           '장비 작동 중 비정상적인 진동이 발생함',
           SYSTIMESTAMP,
           8
       );


-- ========================================
-- 장애 배정
-- ========================================

INSERT INTO ASSIGNMENT (
    failure_id,
    engineer_id,
    dispatcher_id,
    priority_code_id,
    request_note,
    assigned_at
)
VALUES (
           1,
           3,
           2,
           13,
           '장비 비정상 진동 원인을 확인하고 조치해주세요.',
           SYSTIMESTAMP
       );


COMMIT;