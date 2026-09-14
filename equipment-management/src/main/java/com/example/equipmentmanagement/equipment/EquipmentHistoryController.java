package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentHistoryResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/equipments")
public class EquipmentHistoryController {

    private final EquipmentHistoryRepository equipmentHistoryRepository;

    public EquipmentHistoryController(EquipmentHistoryRepository equipmentHistoryRepository) {
        this.equipmentHistoryRepository = equipmentHistoryRepository;
    }

    /**
     * 특정 장비의 상태 변경 이력을 최신순으로 조회합니다.
     */
    @GetMapping("/{id:\\d+}/history")
    public List<EquipmentHistoryResponse> getHistory(@PathVariable Long id) {
        return equipmentHistoryRepository.findByEquipmentIdOrderByChangedAtDesc(id)
                .stream()
                .map(EquipmentHistoryResponse::new)
                .toList();
    }
}
