package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import com.example.equipmentmanagement.equipment.dto.EquipmentUpdateRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

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

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public boolean existsByEqNo(String eqNo) {
        return equipmentRepository.existsByEqNo(eqNo);
    }

    public Equipment getEquipment(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));
    }

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
     * 장비 수정과 수정 이력을 하나의 트랜잭션으로 처리합니다.
     *
     * 수정 시 입력한 변경 사유를 EQUIPMENT_HISTORY에 저장합니다.
     * 상태가 변경되지 않았더라도 실제 수정 작업의 추적이 가능하도록
     * 이전 상태와 현재 상태를 함께 기록합니다.
     */
    @Transactional
    public Equipment updateEquipment(Long id, EquipmentUpdateRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        String comment = request.getComment() == null
                ? ""
                : request.getComment().trim();

        if (comment.isEmpty()) {
            throw new IllegalArgumentException(
                    "장비를 수정하려면 변경 사유를 입력해야 합니다."
            );
        }

        Long previousStatusCodeId = equipment.getStatusCodeId();
        Long newStatusCodeId = request.getStatusCodeId();
        boolean statusChanged = !Objects.equals(
                previousStatusCodeId,
                newStatusCodeId
        );

        System.out.println("================================");
        System.out.println("장비 수정 ID = " + id);
        System.out.println("이전 상태 코드 = " + previousStatusCodeId);
        System.out.println("변경 상태 코드 = " + newStatusCodeId);
        System.out.println("상태 변경 여부 = " + statusChanged);
        System.out.println("변경 사유 = " + comment);
        System.out.println("================================");

        equipment.setEqNo(request.getEqNo());
        equipment.setName(request.getName());
        equipment.setLocation(request.getLocation());
        equipment.setCategoryId(request.getCategoryId());
        equipment.setStatusCodeId(newStatusCodeId);

        Equipment savedEquipment = equipmentRepository.saveAndFlush(equipment);

        String changedBy = getChangedBy();

        EquipmentHistory history = new EquipmentHistory(
                id,
                previousStatusCodeId,
                newStatusCodeId,
                comment,
                changedBy,
                LocalDateTime.now()
        );

        System.out.println("히스토리 저장 시도 - 장비 ID = " + id);
        System.out.println("변경자 = " + changedBy);

        equipmentHistoryRepository.saveAndFlush(history);

        System.out.println("히스토리 저장 완료 - 장비 ID = " + id);

        return savedEquipment;
    }

    private String getChangedBy() {
        Object loginId = session.getAttribute("LOGIN_ID");
        if (loginId == null) {
            loginId = session.getAttribute("loginId");
        }
        return loginId != null ? loginId.toString() : "UNKNOWN";
    }

    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        equipmentRepository.delete(equipment);
    }

    public List<Equipment> getEquipmentsByStatus(Long statusCodeId) {
        return equipmentRepository.findByStatusCodeId(statusCodeId);
    }

    public List<Equipment> searchByName(String name) {
        return equipmentRepository.findByNameContaining(name);
    }
}
