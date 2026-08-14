package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final HttpSession session;

    public EquipmentService(
            EquipmentRepository equipmentRepository,
            HttpSession session
    ) {
        this.equipmentRepository = equipmentRepository;
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

        Object companyIdObject =
                session.getAttribute("COMPANY_ID");

        System.out.println("=================================");
        System.out.println("COMPANY_ID = " + companyIdObject);
        System.out.println("COMPANY_ID TYPE = " +
                (companyIdObject != null
                        ? companyIdObject.getClass()
                        : "null"));
        System.out.println("=================================");

        if (companyIdObject == null) {
            throw new IllegalStateException(
                    "로그인한 사용자의 회사 정보를 찾을 수 없습니다."
            );
        }

        Long companyId =
                Long.valueOf(companyIdObject.toString());

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

    // 장비 수정
    public Equipment updateEquipment(
            Long id,
            EquipmentRequest request
    ) {

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        equipment.setEqNo(request.getEqNo());
        equipment.setName(request.getName());
        equipment.setLocation(request.getLocation());
        equipment.setCategoryId(request.getCategoryId());
        equipment.setStatusCodeId(request.getStatusCodeId());

        return equipmentRepository.save(equipment);
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