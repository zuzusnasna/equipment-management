package com.example.equipmentmanagement.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 장비 수정 요청 DTO입니다.
 * 상태가 변경되는 경우 comment에 변경 사유를 함께 전달합니다.
 */
public class EquipmentUpdateRequest {

    @NotBlank
    private String eqNo;

    @NotBlank
    private String name;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long statusCodeId;

    @NotBlank
    private String location;

    @Size(max = 1000)
    private String comment;

    public String getEqNo() {
        return eqNo;
    }

    public void setEqNo(String eqNo) {
        this.eqNo = eqNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getStatusCodeId() {
        return statusCodeId;
    }

    public void setStatusCodeId(Long statusCodeId) {
        this.statusCodeId = statusCodeId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
