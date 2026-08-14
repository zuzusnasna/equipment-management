package com.example.equipmentmanagement.equipment;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTest {

    @Mock
    private EquipmentRepository equipmentRepository;

    @InjectMocks
    private EquipmentService equipmentService;

    @Test
    void 장비_단건_조회() {

        Equipment equipment =
                new Equipment(
                        1L,              // companyId
                        1L,              // categoryId
                        "EQ-001",        // eqNo
                        "TC Bonder",     // name
                        "Bonder",        // type
                        "정상",          // status
                        "1공장",         // location
                        1L,              // statusCodeId
                        "Y"              // useYn
                );

        when(equipmentRepository.findById(1L))
                .thenReturn(Optional.of(equipment));

        Equipment result =
                equipmentService.getEquipment(1L);

        assertNotNull(result);

        assertEquals("TC Bonder", result.getName());
        assertEquals("Bonder", result.getType());
        assertEquals("정상", result.getStatus());
        assertEquals("1공장", result.getLocation());

        verify(equipmentRepository).findById(1L);
    }

    @Test
    void 없는_장비_조회시_예외발생() {

        when(equipmentRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                EquipmentNotFoundException.class,
                () -> equipmentService.getEquipment(999L)
        );

        verify(equipmentRepository).findById(999L);
    }
}