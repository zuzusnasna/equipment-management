package com.example.equipmentmanagement.equipment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentHistoryRepository extends JpaRepository<EquipmentHistory, Long> {

    List<EquipmentHistory> findByEquipmentIdOrderByChangedAtDesc(Long equipmentId);
}
