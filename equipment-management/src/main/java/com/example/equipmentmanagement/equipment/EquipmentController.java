package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import com.example.equipmentmanagement.equipment.dto.EquipmentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipments")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    // ========================================
    // 전체 조회
    // ========================================

    @Operation(
            summary = "전체 장비 조회",
            description = "등록된 모든 장비 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 전체 조회 성공")
    })
    @GetMapping
    public List<EquipmentResponse> getAllEquipments() {

        return equipmentService.getAllEquipments()
                .stream()
                .map(EquipmentResponse::new)
                .toList();
    }

    // ========================================
    // 장비 번호 중복 확인
    // ========================================

    @GetMapping("/check-duplicate")
    public ResponseEntity<Boolean> checkDuplicate(
            @RequestParam("eqNo") String eqNo
    ) {

        System.out.println("================================");
        System.out.println("중복 확인 요청 eqNo = " + eqNo);

        boolean exists = equipmentService.existsByEqNo(eqNo);

        System.out.println("중복 여부 = " + exists);
        System.out.println("================================");

        return ResponseEntity.ok(exists);
    }

    // ========================================
    // 단건 조회
    // ========================================

    @Operation(
            summary = "장비 상세 조회",
            description = "장비 ID를 이용하여 특정 장비의 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 장비를 찾을 수 없음")
    })
    @GetMapping("/{id:\\d+}")
    public EquipmentResponse getEquipment(
            @PathVariable Long id
    ) {

        return new EquipmentResponse(
                equipmentService.getEquipment(id)
        );
    }

    // ========================================
    // 등록
    // ========================================

    @Operation(
            summary = "장비 등록",
            description = "새로운 장비를 등록합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 등록 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패")
    })
    @PostMapping
    public EquipmentResponse createEquipment(
            @RequestBody @Valid EquipmentRequest request
    ) {

        return new EquipmentResponse(
                equipmentService.createEquipment(request)
        );
    }

    // ========================================
    // 수정
    // ========================================

    @Operation(
            summary = "장비 수정",
            description = "장비 ID를 이용하여 장비 정보를 수정합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패"),
            @ApiResponse(responseCode = "404", description = "해당 장비를 찾을 수 없음")
    })
    @PutMapping("/{id:\\d+}")
    public EquipmentResponse updateEquipment(
            @PathVariable Long id,
            @RequestBody @Valid EquipmentRequest request
    ) {

        return new EquipmentResponse(
                equipmentService.updateEquipment(id, request)
        );
    }

    // ========================================
    // 삭제
    // ========================================

    @Operation(
            summary = "장비 삭제",
            description = "장비 ID를 이용하여 장비를 삭제합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "해당 장비를 찾을 수 없음")
    })
    @DeleteMapping("/{id:\\d+}")
    public void deleteEquipment(
            @PathVariable Long id
    ) {

        equipmentService.deleteEquipment(id);
    }

    // ========================================
    // 상태 검색
    // ========================================

    @Operation(
            summary = "장비 상태 검색",
            description = "장비 상태를 기준으로 장비 목록을 검색합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상태 검색 성공")
    })
    @GetMapping("/search")
    public List<EquipmentResponse> getEquipmentsByStatus(
            @RequestParam Long statusCodeId
    ) {

        return equipmentService.getEquipmentsByStatus(statusCodeId)
                .stream()
                .map(EquipmentResponse::new)
                .toList();
    }

    // ========================================
    // 이름 검색
    // ========================================

    @Operation(
            summary = "장비 이름 검색",
            description = "장비 이름에 포함된 문자열을 기준으로 장비를 검색합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "이름 검색 성공")
    })
    @GetMapping("/search/name")
    public List<EquipmentResponse> searchByName(
            @RequestParam String name
    ) {

        return equipmentService.searchByName(name)
                .stream()
                .map(EquipmentResponse::new)
                .toList();
    }
}

