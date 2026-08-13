package com.example.equipmentmanagement.equipment;

public class EquipmentNotFoundException extends RuntimeException {

    public EquipmentNotFoundException(String message) {
        super(message);
    }
}