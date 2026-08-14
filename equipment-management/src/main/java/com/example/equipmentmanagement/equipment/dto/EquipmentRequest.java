package com.example.equipmentmanagement.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EquipmentRequest {

    @NotBlank(message = "장비 번호는 필수입니다.")
    private String eqNo;

    @NotBlank(message = "장비 이름은 필수입니다.")
    private String name;

    @NotNull(message = "장비 카테고리는 필수입니다.")
    private Long categoryId;

    @NotNull(message = "장비 상태는 필수입니다.")
    private Long statusCodeId;

    @NotBlank(message = "장비 위치는 필수입니다.")
    private String location;

    public EquipmentRequest() {
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

    public String getLocation() {
        return location;
    }

    public void setEqNo(String eqNo) {
        this.eqNo = eqNo;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setStatusCodeId(Long statusCodeId) {
        this.statusCodeId = statusCodeId;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}