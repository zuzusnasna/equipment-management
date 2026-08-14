package com.example.equipmentmanagement.equipment.dto;

import com.example.equipmentmanagement.equipment.Equipment;

public class EquipmentResponse {

    private Long id;
    private String eqNo;
    private String name;
    private Long categoryId;
    private Long statusCodeId;
    private String status;
    private String location;
    private String useYn;

    public EquipmentResponse(Equipment equipment) {
        this.id = equipment.getId();
        this.eqNo = equipment.getEqNo();
        this.name = equipment.getName();
        this.categoryId = equipment.getCategoryId();
        this.statusCodeId = equipment.getStatusCodeId();
        this.status = convertStatus(equipment.getStatusCodeId());
        this.location = equipment.getLocation();
        this.useYn = equipment.getUseYn();
    }

    private String convertStatus(Long statusCodeId) {

        if (statusCodeId == null) {
            return "";
        }

        return switch (statusCodeId.intValue()) {
            case 1 -> "정상";
            case 2 -> "고장";
            case 3 -> "정지";
            default -> "";
        };
    }

    public Long getId() {
        return id;
    }

    public String getEqNo() {
        return eqNo;
    }

    public String getName() {
        return name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public Long getStatusCodeId() {
        return statusCodeId;
    }

    public String getStatus() {
        return status;
    }

    public String getLocation() {
        return location;
    }

    public String getUseYn() {
        return useYn;
    }
}