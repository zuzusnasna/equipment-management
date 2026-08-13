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

## 2. 장비 검색

장비명, 장비 유형, 위치를 기준으로 장비를 검색할 수 있습니다.

예를 들어,

```text
Bonder

<프로젝트 구조>
equipment-management
│
├── backend
│   │
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com.example.equipmentmanagement
│   │   │   │       │
│   │   │   │       ├── EquipmentManagementApplication.java
│   │   │   │       │
│   │   │   │       └── equipment
│   │   │   │           ├── Equipment.java
│   │   │   │           ├── EquipmentController.java
│   │   │   │           ├── EquipmentRepository.java
│   │   │   │           ├── EquipmentService.java
│   │   │   │           ├── EquipmentNotFoundException.java
│   │   │   │           ├── GlobalExceptionHandler.java
│   │   │   │           │
│   │   │   │           └── dto
│   │   │   │               ├── EquipmentRequest.java
│   │   │   │               └── EquipmentResponse.java
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
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md