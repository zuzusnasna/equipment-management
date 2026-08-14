package com.example.equipmentmanagement.equipment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;

@Entity
@Table(name = "EQUIPMENT")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EQUIPMENT_ID")
    private Long id;

    @Column(name = "COMPANY_ID", nullable = false)
    private Long companyId;

    @Column(name = "CATEGORY_ID", nullable = false)
    private Long categoryId;

    @Column(name = "EQ_NO", nullable = false, length = 50)
    private String eqNo;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "TYPE", length = 100)
    private String type;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "LOCATION", length = 200)
    private String location;

    @Column(name = "STATUS_CODE_ID", nullable = false)
    private Long statusCodeId;

    // Oracle DB의 USE_YN이 CHAR(1)이므로 CHAR 타입으로 명시
    @JdbcTypeCode(Types.CHAR)
    @Column(name = "USE_YN", nullable = false, length = 1)
    private String useYn;

    public Equipment() {
    }

    public Equipment(
            Long companyId,
            Long categoryId,
            String eqNo,
            String name,
            String type,
            String status,
            String location,
            Long statusCodeId,
            String useYn
    ) {
        this.companyId = companyId;
        this.categoryId = categoryId;
        this.eqNo = eqNo;
        this.name = name;
        this.type = type;
        this.status = status;
        this.location = location;
        this.statusCodeId = statusCodeId;
        this.useYn = useYn;
    }

    public Long getId() {
        return id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getEqNo() {
        return eqNo;
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

    public Long getStatusCodeId() {
        return statusCodeId;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setEqNo(String eqNo) {
        this.eqNo = eqNo;
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

    public void setStatusCodeId(Long statusCodeId) {
        this.statusCodeId = statusCodeId;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }
}