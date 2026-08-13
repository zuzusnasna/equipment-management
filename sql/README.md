# Oracle SQL

Equipment Management 프로젝트에서 사용하는 Oracle Database SQL 스크립트입니다.

프로젝트의 데이터베이스 구조 생성부터 초기 데이터 입력,
장애 처리 프로세스 및 조회 쿼리까지 단계별로 관리합니다.

---

## 📂 SQL 파일 구조

```text
sql/
├── 01_ddl_create_tables.sql
├── 02_dml_insert_master_data.sql
├── 03_dml_insert_test_data.sql
├── 04_failure_process.sql
├── 05_equipment_manager.sql
├── 06_failure_review.sql
├── 07_audit_log.sql
├── 08_select_queries.sql
└── README.md