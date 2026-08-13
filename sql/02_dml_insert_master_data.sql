-- ========================================
-- 02. 마스터 데이터 입력
-- ========================================

-- 회사
INSERT INTO COMPANY (
    name,
    biz_no,
    use_yn
)
VALUES (
           '테크솔루션',
           '123-45-67890',
           'Y'
       );


-- 사용자
INSERT INTO USERS (
    company_id,
    login_id,
    password,
    name,
    role
)
VALUES (
           1,
           'master01',
           '1234',
           '관리자',
           'MASTER'
       );

INSERT INTO USERS (
    company_id,
    login_id,
    password,
    name,
    role
)
VALUES (
           1,
           'dispatcher01',
           '1234',
           '김배정',
           'DISPATCHER'
       );

INSERT INTO USERS (
    company_id,
    login_id,
    password,
    name,
    role
)
VALUES (
           1,
           'engineer01',
           '1234',
           '이엔지니어',
           'ENGINEER'
       );

INSERT INTO USERS (
    company_id,
    login_id,
    password,
    name,
    role
)
VALUES (
           1,
           'engineer02',
           '1234',
           '박엔지니어',
           'ENGINEER'
       );


-- 장비 분류
INSERT INTO EQUIPMENT_CATEGORY (
    name,
    parent_id,
    use_yn
)
VALUES (
           '생산장비',
           NULL,
           'Y'
       );

INSERT INTO EQUIPMENT_CATEGORY (
    name,
    parent_id,
    use_yn
)
VALUES (
           '가공장비',
           1,
           'Y'
       );

INSERT INTO EQUIPMENT_CATEGORY (
    name,
    parent_id,
    use_yn
)
VALUES (
           '검사장비',
           1,
           'Y'
       );


-- 장비 상태
INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('EQUIPMENT_STATUS', 'NORMAL', '정상', 1, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('EQUIPMENT_STATUS', 'ERROR', '장애', 2, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('EQUIPMENT_STATUS', 'STOPPED', '가동중지', 3, 'Y');


-- 장애 유형
INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_TYPE', 'MECHANICAL', '기계적 이상', 1, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_TYPE', 'ELECTRICAL', '전기적 이상', 2, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_TYPE', 'SENSOR', '센서 이상', 3, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_TYPE', 'SOFTWARE', '소프트웨어 이상', 4, 'Y');


-- 장애 상태
INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_STATUS', 'RECEIVED', '접수', 1, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_STATUS', 'ASSIGNED', '배정', 2, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_STATUS', 'PROCESSING', '처리중', 3, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_STATUS', 'COMPLETED', '처리완료', 4, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('FAILURE_STATUS', 'CLOSED', '최종완료', 5, 'Y');


-- 중요도
INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('PRIORITY', 'HIGH', '긴급', 1, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('PRIORITY', 'MEDIUM', '보통', 2, 'Y');

INSERT INTO COMMON_CODE
(group_code, code, name, sort_order, use_yn)
VALUES
    ('PRIORITY', 'LOW', '낮음', 3, 'Y');

COMMIT;