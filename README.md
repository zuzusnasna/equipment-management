# 🏭 Equipment Management API

Spring Boot와 JPA를 기반으로 구현한 **장비 관리 REST API 프로젝트**입니다.

장비 정보를 등록하고 조회·수정·삭제할 수 있으며,
장비 상태와 이름을 기준으로 검색할 수 있도록 구현했습니다.

---

## 📌 프로젝트 소개

제조 현장에서 사용하는 장비 정보를 효율적으로 관리하는 것을 목표로
장비 관리 CRUD API를 구현했습니다.

REST API 설계부터 데이터베이스 연동,
입력값 검증, 예외 처리, 테스트, Swagger API 문서화까지
백엔드 개발의 기본적인 흐름을 경험하는 데 중점을 두었습니다.

---

## 🛠 기술 스택

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
| Version Control | Git / GitHub |


---
| Method | URL                               | 설명       |
| ------ | --------------------------------- | -------- |
| GET    | `/equipments`                     | 전체 장비 조회 |
| GET    | `/equipments/{id}`                | 장비 단건 조회 |
| POST   | `/equipments`                     | 장비 등록    |
| PUT    | `/equipments/{id}`                | 장비 수정    |
| DELETE | `/equipments/{id}`                | 장비 삭제    |
| GET    | `/equipments/search?status=정상`    | 상태 검색    |
| GET    | `/equipments/search/name?name=TC` | 이름 검색    |
```text
## 📂 프로젝트 구조

```text
equipment-management
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.example.equipmentmanagement
│   │   │       ├── EquipmentManagementApplication.java
│   │   │       │
│   │   │       └── equipment
│   │   │           ├── Equipment.java
│   │   │           ├── EquipmentController.java
│   │   │           ├── EquipmentRepository.java
│   │   │           ├── EquipmentService.java
│   │   │           ├── EquipmentNotFoundException.java
│   │   │           ├── GlobalExceptionHandler.java
│   │   │           │
│   │   │           └── dto
│   │   │               ├── EquipmentRequest.java
│   │   │               └── EquipmentResponse.java
│   │   │
│   │   └── resources
│   │       └── application.properties
│   │
│   └── test
│       └── java
│           └── com.example.equipmentmanagement
│               └── equipment
│                   ├── EquipmentControllerTest.java
│                   └── EquipmentServiceTest.java
│
├── pom.xml
└── README.md