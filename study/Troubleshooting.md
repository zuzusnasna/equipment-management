# 🛠️ Equipment Management System Troubleshooting

장비 관리 시스템을 구현하면서 실제 코드에서 확인하고 해결한 문제와 설계 과정에서 주의했던 내용을 정리합니다.

> 프로젝트: Spring Boot + React 기반 장비 관리 시스템
>
> Backend: Spring Boot / JPA / Oracle / REST API / Validation / Spring Security / Swagger
>
> Frontend: React / Vite / Fetch API

---

## 1. 장비 조회에서 존재하지 않는 ID 처리

### 문제

장비 상세 조회·수정·삭제에서는 전달받은 ID가 실제 DB에 존재하지 않을 수 있습니다.
단순히 `findById()`의 결과를 바로 사용하면 존재하지 않는 장비에 대한 처리가 명확하지 않았습니다.

### 원인

Spring Data JPA의 `findById()`는 결과를 `Optional`로 반환합니다.
따라서 조회 결과가 없는 경우를 명시적으로 처리해야 합니다.

### 해결

서비스 계층에서 `orElseThrow()`를 사용하여 장비가 없으면 사용자 정의 예외를 발생시키도록 했습니다.

```java
public Equipment getEquipment(Long id) {
    return equipmentRepository.findById(id)
            .orElseThrow(() ->
                    new EquipmentNotFoundException("장비를 찾을 수 없습니다."));
}
```

수정과 삭제에서도 같은 방식으로 존재 여부를 검증했습니다.

### 결과

존재하지 않는 장비를 요청하면 애플리케이션 내부에서 일관되게 `EquipmentNotFoundException`이 발생하도록 만들었습니다.

---

## 2. 사용자 정의 예외를 HTTP 404 응답으로 변환

### 문제

존재하지 않는 장비에 대해 예외를 발생시키는 것만으로는 REST API 사용자가 이해하기 쉬운 HTTP 응답을 만들기 어려웠습니다.

### 해결

`@RestControllerAdvice`와 `@ExceptionHandler`를 이용해 전역 예외 처리를 구현했습니다.

```java
@ExceptionHandler(EquipmentNotFoundException.class)
public ResponseEntity<Map<String, Object>> handleNotFound(
        EquipmentNotFoundException e) {

    Map<String, Object> response = new HashMap<>();
    response.put("status", 404);
    response.put("message", e.getMessage());

    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(response);
}
```

### 결과

존재하지 않는 장비 요청은 다음과 같이 REST API의 `404 Not Found` 응답으로 처리됩니다.

```json
{
  "status": 404,
  "message": "장비를 찾을 수 없습니다."
}
```

---

## 3. `@Valid` 요청 데이터의 검증 실패 처리

### 문제

장비 등록·수정 API는 클라이언트에서 전달받는 값을 그대로 저장하면 잘못된 데이터가 DB에 들어갈 가능성이 있습니다.

### 해결

Controller에서 `EquipmentRequest`에 `@Valid`를 적용하고, 전역 예외 처리에서 `MethodArgumentNotValidException`을 처리했습니다.

```java
@PostMapping
public EquipmentResponse createEquipment(
        @RequestBody @Valid EquipmentRequest request
) {
    return new EquipmentResponse(
            equipmentService.createEquipment(request)
    );
}
```

그리고 `GlobalExceptionHandler`에서 검증 실패 메시지를 HTTP 400 응답으로 변환했습니다.

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, Object>> handleValidation(
        MethodArgumentNotValidException e) {

    Map<String, Object> response = new HashMap<>();
    response.put("status", 400);
    response.put(
            "message",
            e.getBindingResult()
                    .getFieldError()
                    .getDefaultMessage()
    );

    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(response);
}
```

### 결과

잘못된 요청은 서비스나 Repository까지 전달하기 전에 `400 Bad Request`로 처리할 수 있게 되었습니다.

---

## 4. 장비 등록 시 로그인 회사 정보와 요청 데이터의 분리

### 문제

장비 등록 시 `companyId`를 요청 JSON에 포함시키는 방식은 클라이언트가 다른 회사 ID를 전달할 가능성이 있습니다.

### 해결

현재 구현에서는 `HttpSession`의 `COMPANY_ID`를 읽어 로그인한 사용자의 회사 정보를 사용하도록 처리했습니다.

```java
Object companyIdObject = session.getAttribute("COMPANY_ID");

if (companyIdObject == null) {
    throw new IllegalStateException(
            "로그인한 사용자의 회사 정보를 찾을 수 없습니다."
    );
}

Long companyId = Long.valueOf(companyIdObject.toString());
```

이후 장비 Entity에는 요청 객체의 회사 ID가 아니라 세션에서 가져온 회사 ID를 저장합니다.

### 결과

장비 등록 시 회사 식별 정보를 클라이언트 입력값에만 의존하지 않고 로그인 세션과 연결할 수 있도록 했습니다.

---

## 5. 장비 번호 중복 확인 API 분리

### 문제

장비 번호(`eqNo`)는 장비를 구분하는 중요한 값이므로 등록 전에 중복 여부를 확인할 필요가 있었습니다.

### 해결

Repository의 존재 여부 확인 기능을 서비스로 분리하고 Controller에서 별도의 API로 제공했습니다.

```java
@GetMapping("/check-duplicate")
public ResponseEntity<Boolean> checkDuplicate(
        @RequestParam("eqNo") String eqNo
) {
    boolean exists = equipmentService.existsByEqNo(eqNo);
    return ResponseEntity.ok(exists);
}
```

### 결과

React 프론트엔드에서 장비 번호를 입력한 뒤 별도로 중복 여부를 확인할 수 있게 되었습니다.

---

## 6. REST API 경로 충돌을 피하기 위한 숫자 ID 경로 제한

### 문제

장비 단건 조회·수정·삭제는 `/equipments/{id}` 형태를 사용하고, 검색 API도 `/equipments/search` 형태를 사용합니다.

문자열 `search`가 `{id}` 경로로 잘못 해석되는 상황을 피할 필요가 있었습니다.

### 해결

ID를 숫자로 제한하는 정규식 경로 변수를 적용했습니다.

```java
@GetMapping("/{id:\\d+}")
public EquipmentResponse getEquipment(
        @PathVariable Long id
) {
    return new EquipmentResponse(
            equipmentService.getEquipment(id)
    );
}
```

수정·삭제 API에도 동일한 패턴을 적용했습니다.

### 결과

`/equipments/1`과 같은 숫자 ID 요청만 `{id}` 경로에 매칭되고, `/equipments/search`와 같은 검색 경로와 명확하게 분리할 수 있습니다.

---

## 7. Controller와 Service 테스트를 분리

### 문제

REST API가 정상적으로 동작하는지 확인하면서 동시에 서비스의 예외 처리까지 검증하려면 테스트 대상과 책임을 분리할 필요가 있었습니다.

### 해결

Controller 테스트에서는 `@WebMvcTest`와 `MockMvc`를 사용하여 HTTP 요청·응답을 검증하고, Service 테스트에서는 Mockito를 이용하여 Repository 동작을 가짜 객체로 대체했습니다.

Controller 테스트에서는 전체 조회, 단건 조회, 등록, 수정, 삭제와 존재하지 않는 장비에 대한 404 응답을 검증했습니다.

Service 테스트에서는 정상 조회와 존재하지 않는 장비 조회 시 `EquipmentNotFoundException` 발생 여부를 검증했습니다.

### 결과

Controller와 Service의 책임을 분리하여 테스트할 수 있게 되었고, 기본 CRUD와 예외 처리에 대한 테스트를 확보했습니다.

---

## 8. Spring Boot와 프론트엔드 기술 구성 확인

### 문제

백엔드와 프론트엔드를 함께 구성하면서 각 기술의 역할을 명확하게 분리할 필요가 있었습니다.

### 해결

백엔드는 Spring Boot 기반 REST API로 구성하고, JPA를 통해 Oracle Database와 연결했습니다. 프론트엔드는 React와 Vite를 사용하고 Fetch API로 백엔드 API를 호출하는 구조로 분리했습니다.

현재 Backend `pom.xml`에는 JPA, Web MVC, Oracle JDBC, Validation, Spring Security, Swagger, 테스트 관련 의존성이 구성되어 있습니다.

### 결과

React는 화면과 사용자 상호작용을 담당하고 Spring Boot는 API와 비즈니스 로직, JPA는 데이터 접근을 담당하는 구조로 역할을 분리했습니다.

---

## 9. 정리

이번 프로젝트에서 문제를 해결하면서 단순 CRUD 구현보다 다음과 같은 구조적 처리가 중요하다는 점을 확인했습니다.

- `Optional`을 이용한 조회 결과의 명확한 처리
- 사용자 정의 예외와 전역 예외 처리
- `@Valid`를 이용한 입력값 검증
- 세션 정보를 활용한 사용자 회사 정보 처리
- 장비 번호 중복 확인
- REST API 경로 충돌 방지
- Controller / Service 계층별 테스트 분리
- React와 Spring Boot REST API의 역할 분리

이 과정을 통해 장비 관리 시스템의 CRUD 기능뿐만 아니라 예외 처리, 검증, 테스트, 인증 정보 활용까지 실제 웹 애플리케이션에서 필요한 기본 구조를 경험했습니다.
