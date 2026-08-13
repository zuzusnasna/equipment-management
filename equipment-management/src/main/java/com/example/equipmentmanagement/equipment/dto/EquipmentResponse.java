package com.example.equipmentmanagement.equipment.dto;

import com.example.equipmentmanagement.equipment.Equipment;

public class EquipmentResponse {

    private Long id;
    private String name;
    private String type;
    private String status;
    private String location;

    public EquipmentResponse(Equipment equipment) {
        this.id = equipment.getId();
        this.name = equipment.getName();
        this.type = equipment.getType();
        this.status = equipment.getStatus();
        this.location = equipment.getLocation();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getStatus() {
        return status;
    }

    public String getLocation() {
        return location;
    }
}