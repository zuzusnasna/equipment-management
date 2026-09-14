package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import com.example.equipmentmanagement.equipment.dto.EquipmentUpdateRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentHistoryRepository equipmentHistoryRepository;
    private final HttpSession session;

    public EquipmentService(
            EquipmentRepository equipmentRepository,
            EquipmentHistoryRepository equipmentHistoryRepository,
            HttpSession session
    ) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentHistoryRepository = equipmentHistoryRepository;
        this.session = session;
    }

    // 전체 장비 조회
    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public boolean existsByEqNo(String eqNo) {
        return equipmentRepository.existsByEqNo(eqNo);
    }

    // 특정 장비 조회
    public Equipment getEquipment(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));
    }

    // 장비 등록
    public Equipment createEquipment(EquipmentRequest request) {
        Object companyIdObject = session.getAttribute("COMPANY_ID");

        if (companyIdObject == null) {
            throw new IllegalStateException(
                    "로그인한 사용자의 회사 정보를 찾을 수 없습니다."
            );
        }

        Long companyId = Long.valueOf(companyIdObject.toString());

        Equipment equipment = new Equipment();
        equipment.setCompanyId(companyId);
        equipment.setEqNo(request.getEqNo());
        equipment.setName(request.getName());
        equipment.setLocation(request.getLocation());
        equipment.setCategoryId(request.getCategoryId());
        equipment.setStatusCodeId(request.getStatusCodeId());
        equipment.setUseYn("Y");

        return equipmentRepository.save(equipment);
    }

    /**
     * 장비 정보를 수정합니다.
     *
     * 상태 코드가 실제로 변경된 경우에는 변경 사유를 반드시 입력받고,
     * 장비 수정과 상태 변경 이력을 하나의 트랜잭션으로 처리합니다.
     */
    @Transactional
    public Equipment updateEquipment(Long id, EquipmentUpdateRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        Long previousStatusCodeId = equipment.getStatusCodeId();
        Long newStatusCodeId = request.getStatusCodeId();
        boolean statusChanged = !java.util.Objects.equals(
                previousStatusCodeId,
                newStatusCodeId
        );

        if (statusChanged && (request.getComment() == null
                || request.getComment().trim().isEmpty())) {
            throw new IllegalArgumentException(
                    "장비 상태를 변경하려면 변경 사유를 입력해야 합니다."
            );
        }

        equipment.setEqNo(request.getEqNo());
        equipment.setName(request.getName());
        equipment.setLocation(request.getLocation());
        equipment.setCategoryId(request.getCategoryId());
        equipment.setStatusCodeId(newStatusCodeId);

        Equipment savedEquipment = equipmentRepository.save(equipment);

        if (statusChanged) {
            String changedBy = getChangedBy();

            EquipmentHistory history = new EquipmentHistory(
                    id,
                    previousStatusCodeId,
                    newStatusCodeId,
                    request.getComment().trim(),
                    changedBy,
                    LocalDateTime.now()
            );

            equipmentHistoryRepository.save(history);
        }

        return savedEquipment;
    }

    /**
     * 현재 로그인한 사용자의 ID를 변경자 정보로 사용합니다.
     * 로그인 세션에 저장된 값이 없는 경우 추적성을 위해 UNKNOWN으로 기록합니다.
     */
    private String getChangedBy() {
        Object loginId = session.getAttribute("LOGIN_ID");
        if (loginId == null) {
            loginId = session.getAttribute("loginId");
        }
        return loginId != null ? loginId.toString() : "UNKNOWN";
    }

    // 장비 삭제
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        equipmentRepository.delete(equipment);
    }

    // 상태별 장비 조회
    public List<Equipment> getEquipmentsByStatus(Long statusCodeId) {
        return equipmentRepository.findByStatusCodeId(statusCodeId);
    }

    // 이름 검색
    public List<Equipment> searchByName(String name) {
        return equipmentRepository.findByNameContaining(name);
    }
}
