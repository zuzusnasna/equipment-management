package com.example.equipmentmanagement.equipment;

import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public Equipment getEquipment(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));
    }

    public Equipment createEquipment(EquipmentRequest request) {

        Equipment equipment = new Equipment(
                request.getName(),
                request.getType(),
                request.getStatus(),
                request.getLocation()
        );

        return equipmentRepository.save(equipment);
    }

    public Equipment updateEquipment(Long id, EquipmentRequest request) {

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        equipment.setName(request.getName());
        equipment.setType(request.getType());
        equipment.setStatus(request.getStatus());
        equipment.setLocation(request.getLocation());

        return equipmentRepository.save(equipment);
    }

    public void deleteEquipment(Long id) {

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new EquipmentNotFoundException("장비를 찾을 수 없습니다."));

        equipmentRepository.delete(equipment);
    }

    public List<Equipment> getEquipmentsByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }

    public List<Equipment> searchByName(String name) {
        return equipmentRepository.findByNameContaining(name);
    }
}