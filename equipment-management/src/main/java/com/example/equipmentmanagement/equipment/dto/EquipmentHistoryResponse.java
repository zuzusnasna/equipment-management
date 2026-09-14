package com.example.equipmentmanagement.equipment.dto;

import com.example.equipmentmanagement.equipment.EquipmentHistory;

import java.time.LocalDateTime;

public class EquipmentHistoryResponse {

    private final Long id;
    private final Long equipmentId;
    private final Long previousStatusCodeId;
    private final Long newStatusCodeId;
    private final String comment;
    private final String changedBy;
    private final LocalDateTime changedAt;

    public EquipmentHistoryResponse(EquipmentHistory history) {
        this.id = history.getId();
        this.equipmentId = history.getEquipmentId();
        this.previousStatusCodeId = history.getPreviousStatusCodeId();
        this.newStatusCodeId = history.getNewStatusCodeId();
        this.comment = history.getComment();
        this.changedBy = history.getChangedBy();
        this.changedAt = history.getChangedAt();
    }

    public Long getId() { return id; }
    public Long getEquipmentId() { return equipmentId; }
    public Long getPreviousStatusCodeId() { return previousStatusCodeId; }
    public Long getNewStatusCodeId() { return newStatusCodeId; }
    public String getComment() { return comment; }
    public String getChangedBy() { return changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
}
