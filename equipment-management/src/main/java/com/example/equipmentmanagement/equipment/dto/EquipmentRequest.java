package com.example.equipmentmanagement.equipment.dto;

import jakarta.validation.constraints.NotBlank;

public class EquipmentRequest {

    @NotBlank(message = "장비 이름은 필수입니다.")
    private String name;

    @NotBlank(message = "장비 종류는 필수입니다.")
    private String type;

    @NotBlank(message = "장비 상태는 필수입니다.")
    private String status;

    @NotBlank(message = "장비 위치는 필수입니다.")
    private String location;

    public EquipmentRequest() {
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
    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}