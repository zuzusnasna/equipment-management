# 🏭 Equipment Management System

Spring Boot와 React를 기반으로 구현한 **장비 관리 시스템**입니다.

제조 현장에서 사용하는 장비 정보를 등록하고 조회·수정·삭제할 수 있으며,
장비 상태와 장비명·유형·위치를 기준으로 검색 및 필터링할 수 있도록 구현했습니다.

또한 공장별 장비 현황과 상태별 장비 수를 한눈에 확인할 수 있도록
대시보드 형태의 UI를 구현했습니다.

---

## 📌 프로젝트 소개

제조 현장에서 관리되는 장비 정보를 효율적으로 관리하는 것을 목표로
장비 관리 시스템을 구현했습니다.

단순한 CRUD 기능 구현에 그치지 않고,

- REST API 설계
- 데이터베이스 연동
- 입력값 검증
- 예외 처리
- 검색 및 필터링
- 공장별 장비 현황
- 대시보드
- 장비 상태 변경 이력 관리
- 반응형 UI
- API 테스트
- Swagger API 문서화

등 실제 웹 서비스 개발 과정에서 사용되는 기능들을 직접 구현하는 데
중점을 두었습니다.

---

## 🎯 프로젝트 목표

1. Spring Boot 기반 REST API 설계 및 구현
2. JPA를 이용한 Oracle Database 연동
3. 장비 CRUD 기능 구현
4. 장비 검색 및 상태 필터 기능 구현
5. 공장별 장비 현황 조회 기능 구현
6. React 기반 프론트엔드 구현
7. 백엔드 API와 프론트엔드 연동
8. 예외 처리 및 입력값 검증
9. JUnit과 Mockito를 이용한 테스트
10. Swagger를 이용한 API 문서화
11. 반응형 UI 구현
12. 장비 상태 변경 이력 및 변경 사유 관리

---

# 🛠 기술 스택

## Backend

| 구분 | 기술 |
|---|---|
| Language | Java 26 |
| Framework | Spring Boot 4.1.0 |
| ORM | Spring Data JPA |
| Database | Oracle Database |
| Build Tool | Maven |
| API | REST API |
| Validation | Jakarta Validation |
| Documentation | Swagger / OpenAPI |
| Test | JUnit 6, Mockito |
| IDE | IntelliJ IDEA |

## Frontend

| 구분 | 기술 |
|---|---|
| Language | JavaScript |
| Framework | React |
| Build Tool | Vite |
| HTTP 통신 | Fetch API |
| Styling | CSS |
| IDE | IntelliJ IDEA / VS Code |

## DevOps / Version Control

| 구분 | 기술 |
|---|---|
| Version Control | Git |
| Repository | GitHub |

---

# ✨ 주요 기능

## 1. 장비 CRUD

장비 정보를 등록하고 조회·수정·삭제할 수 있습니다.

### 장비 정보

- 장비 ID
- 장비명
- 장비 유형
- 상태
- 위치

### 지원 기능

- 장비 등록
- 전체 장비 조회
- 장비 단건 조회
- 장비 수정
- 장비 삭제

---

## 2. 장비 검색 및 필터링

장비명, 장비 유형, 위치 및 상태를 기준으로 장비를 검색하고 필터링할 수 있습니다.

예를 들어 장비명에 `Bonder`를 입력하여 특정 장비를 조회할 수 있습니다.

---

## 3. 장비 상태 변경 이력

장비의 상태가 변경될 때 변경 내역을 별도로 저장하여 장비의 상태 변경 이력을 확인할 수 있도록 구현했습니다.

### 기록 정보

- 장비 ID
- 변경 전 상태
- 변경 후 상태
- 변경 사유
- 변경 사용자
- 변경 일시

### 주요 기능

- 장비 수정 시 상태 변경 이력 저장
- 상태 변경 시 변경 사유 입력 필수
- 변경 사용자 및 변경 일시 기록
- 장비별 변경 이력 조회
- 최신 변경 이력부터 조회

변경 이력은 `EQUIPMENT_HISTORY` 테이블에 저장하며,
장비별 상태 변화 과정을 추적할 수 있도록 구성했습니다.

---

## 4. 공장별 장비 현황

공장별 장비 수와 상태별 장비 현황을 대시보드에서 확인할 수 있습니다.

---

## 5. 대시보드

로그인 후 전체 장비 현황과 공장별 장비 현황을 한눈에 확인할 수 있도록
대시보드 형태의 UI를 구현했습니다.

---

## 6. 로그인

장비 관리 시스템 사용자를 대상으로 로그인 기능을 구현했습니다.

- 사용자 로그인
- 세션 기반 사용자 정보 관리
- 로그아웃
- 로그인 상태에 따른 장비 관리 화면 접근

---

## 🧪 테스트

백엔드의 Controller와 Service 계층을 대상으로
JUnit과 Mockito를 이용한 단위 테스트를 작성했습니다.

---

## 📚 API 문서

Swagger / OpenAPI를 사용하여 REST API 명세를 확인할 수 있도록 구성했습니다.

---

## 📁 프로젝트 구조

```text
equipment-management
│
├── equipment-management
│   │
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com.example.equipmentmanagement
│   │   │   │       ├── EquipmentManagementApplication.java
│   │   │   │       └── equipment
│   │   │   │           ├── Equipment.java
│   │   │   │           ├── EquipmentController.java
│   │   │   │           ├── EquipmentRepository.java
│   │   │   │           ├── EquipmentService.java
│   │   │   │           ├── EquipmentNotFoundException.java
│   │   │   │           ├── GlobalExceptionHandler.java
│   │   │   │           ├── EquipmentHistory.java
│   │   │   │           ├── EquipmentHistoryController.java
│   │   │   │           ├── EquipmentHistoryRepository.java
│   │   │   │           │
│   │   │   │           └── dto
│   │   │   │               ├── EquipmentRequest.java
│   │   │   │               ├── EquipmentResponse.java
│   │   │   │               ├── EquipmentUpdateRequest.java
│   │   │   │               └── EquipmentHistoryResponse.java
│   │   │   │
│   │   │   └── resources
│   │   │       └── application.properties
│   │   │
│   │   └── test
│   │       └── java
│   │           └── com.example.equipmentmanagement
│   │               └── equipment
│   │                   ├── EquipmentControllerTest.java
│   │                   └── EquipmentServiceTest.java
│   │
│   └── pom.xml
│
├── frontend
│   │
│   ├── src
│   │   ├── api
│   │   │   └── equipmentApi.js
│   │   │
│   │   ├── components
│   │   │   ├── EquipmentHistory.jsx
│   │   │   └── EquipmentHistory.css
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── sql
│   └── 09_equipment_history.sql
│
└── README.md
```
