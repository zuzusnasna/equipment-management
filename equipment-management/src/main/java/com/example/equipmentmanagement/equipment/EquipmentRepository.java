package com.example.equipmentmanagement.equipment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByStatusCodeId(Long statusCodeId);

    List<Equipment> findByNameContaining(String name);
    boolean existsByEqNo(String eqNo);
}