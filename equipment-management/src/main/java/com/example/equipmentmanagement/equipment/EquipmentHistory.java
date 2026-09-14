package com.example.equipmentmanagement.equipment;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 장비의 상태 변경 이력을 저장하는 엔티티입니다.
 *
 * 상태가 변경될 때마다 변경 전 상태, 변경 후 상태, 변경 사유,
 * 변경자, 변경 시간을 별도로 기록하여 장비 상태의 추적성을 확보합니다.
 */
@Entity
@Table(name = "EQUIPMENT_HISTORY")
public class EquipmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HISTORY_ID")
    private Long id;

    @Column(name = "EQUIPMENT_ID", nullable = false)
    private Long equipmentId;

    @Column(name = "PREVIOUS_STATUS_CODE_ID", nullable = false)
    private Long previousStatusCodeId;

    @Column(name = "NEW_STATUS_CODE_ID", nullable = false)
    private Long newStatusCodeId;

    @Column(name = "COMMENT", nullable = false, length = 1000)
    private String comment;

    @Column(name = "CHANGED_BY", nullable = false, length = 100)
    private String changedBy;

    @Column(name = "CHANGED_AT", nullable = false)
    private LocalDateTime changedAt;

    protected EquipmentHistory() {
    }

    public EquipmentHistory(Long equipmentId, Long previousStatusCodeId,
                            Long newStatusCodeId, String comment,
                            String changedBy, LocalDateTime changedAt) {
        this.equipmentId = equipmentId;
        this.previousStatusCodeId = previousStatusCodeId;
        this.newStatusCodeId = newStatusCodeId;
        this.comment = comment;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public Long getPreviousStatusCodeId() {
        return previousStatusCodeId;
    }

    public Long getNewStatusCodeId() {
        return newStatusCodeId;
    }

    public String getComment() {
        return comment;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }
}
