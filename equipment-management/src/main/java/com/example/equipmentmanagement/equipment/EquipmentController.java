package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import com.example.equipmentmanagement.equipment.dto.EquipmentResponse;
import com.example.equipmentmanagement.equipment.dto.EquipmentUpdateRequest;
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

    @Operation(summary = "전체 장비 조회", description = "등록된 모든 장비 정보를 조회합니다.")
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

    @GetMapping("/check-duplicate")
    public ResponseEntity<Boolean> checkDuplicate(@RequestParam("eqNo") String eqNo) {
        return ResponseEntity.ok(equipmentService.existsByEqNo(eqNo));
    }

    @Operation(summary = "장비 상세 조회", description = "장비 ID를 이용하여 특정 장비의 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 장비를 찾을 수 없음")
    })
    @GetMapping("/{id:\\d+}")
    public EquipmentResponse getEquipment(@PathVariable Long id) {
        return new EquipmentResponse(equipmentService.getEquipment(id));
    }

    @Operation(summary = "장비 등록", description = "새로운 장비를 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 등록 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패")
    })
    @PostMapping
    public EquipmentResponse createEquipment(@RequestBody @Valid EquipmentRequest request) {
        return new EquipmentResponse(equipmentService.createEquipment(request));
    }

    @Operation(
            summary = "장비 수정",
            description = "장비 정보를 수정하며 상태가 변경되면 변경 사유를 상태 이력으로 저장합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "장비 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패 또는 상태 변경 사유 누락"),
            @ApiResponse(responseCode = "404", description = "해당 장비를 찾을 수 없음")
    })
    @PutMapping("/{id:\\d+}")
    public EquipmentResponse updateEquipment(
            @PathVariable Long id,
            @RequestBody @Valid EquipmentUpdateRequest request
    ) {
        return new EquipmentResponse(equipmentService.updateEquipment(id, request));
    }

    @Operation(summary = "장비 삭제", description = "장비 ID를 이용하여 장비를 삭제합니다.")
    @DeleteMapping("/{id:\\d+}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
    }

    @Operation(summary = "장비 상태 검색", description = "장비 상태를 기준으로 장비 목록을 검색합니다.")
    @GetMapping("/search")
    public List<EquipmentResponse> getEquipmentsByStatus(@RequestParam Long statusCodeId) {
        return equipmentService.getEquipmentsByStatus(statusCodeId)
                .stream()
                .map(EquipmentResponse::new)
                .toList();
    }

    @Operation(summary = "장비 이름 검색", description = "장비 이름에 포함된 문자열을 기준으로 장비를 검색합니다.")
    @GetMapping("/search/name")
    public List<EquipmentResponse> searchByName(@RequestParam String name) {
        return equipmentService.searchByName(name)
                .stream()
                .map(EquipmentResponse::new)
                .toList();
    }
}
