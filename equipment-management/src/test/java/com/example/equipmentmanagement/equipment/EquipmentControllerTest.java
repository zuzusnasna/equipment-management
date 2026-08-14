package com.example.equipmentmanagement.equipment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;
import com.example.equipmentmanagement.equipment.dto.EquipmentRequest;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EquipmentController.class)
class EquipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EquipmentService equipmentService;

    // ========================================
    // 1. 전체 장비 조회
    // ========================================
    @Test
    void 전체장비조회() throws Exception {

        when(equipmentService.getAllEquipments())
                .thenReturn(Collections.emptyList());

        mockMvc.perform(
                        get("/equipments")
                )
                .andExpect(status().isOk());
    }

    // ========================================
    // 2. 장비 단건 조회
    // ========================================
    @Test
    void 장비단건조회() throws Exception {

        Equipment equipment = new Equipment(
                1L,
                1L,
                "EQ-001",
                "TC Bonder",
                "Bonder",
                "정상",
                "1공장",
                1L,
                "Y"
        );

        when(equipmentService.getEquipment(1L))
                .thenReturn(equipment);

        mockMvc.perform(
                        get("/equipments/1")
                )
                .andExpect(status().isOk());
    }

    // ========================================
    // 3. 장비 등록
    // ========================================
    @Test
    void 장비등록() throws Exception {

        String json = """
                {
                    "companyId": 1,
                    "categoryId": 1,
                    "eqNo": "EQ-TEST-001",
                    "name": "TEST Bonder",
                    "type": "Bonder",
                    "status": "정상",
                    "location": "1공장",
                    "statusCodeId": 1,
                    "useYn": "Y"
                }
                """;
        Equipment savedEquipment = new Equipment(
                1L,
                1L,
                "EQ-TEST-001",
                "TEST Bonder",
                "Bonder",
                "정상",
                "1공장",
                1L,
                "Y"
        );

        when(equipmentService.createEquipment(
                org.mockito.ArgumentMatchers.any(
                        com.example.equipmentmanagement.equipment.dto.EquipmentRequest.class
                )
        )).thenReturn(savedEquipment);
        mockMvc.perform(
                        post("/equipments")
                                .contentType("application/json")
                                .content(json)
                )
                .andExpect(status().isOk());
    }

    // ========================================
    // 4. 장비 수정
    // ========================================
    @Test
    void 장비수정() throws Exception {

        String json = """
                {
                    "companyId": 1,
                    "categoryId": 1,
                    "eqNo": "EQ-TEST-001",
                    "name": "수정된 Bonder",
                    "type": "Bonder",
                    "status": "점검중",
                    "location": "2공장",
                    "statusCodeId": 2,
                    "useYn": "Y"
                }
                """;
        Equipment updatedEquipment = new Equipment(
                1L,
                1L,
                "EQ-TEST-001",
                "수정된 Bonder",
                "Bonder",
                "점검중",
                "2공장",
                2L,
                "Y"
        );

        when(equipmentService.updateEquipment(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any(
                        com.example.equipmentmanagement.equipment.dto.EquipmentRequest.class
                )
        )).thenReturn(updatedEquipment);
        mockMvc.perform(
                        put("/equipments/1")
                                .contentType("application/json")
                                .content(json)
                )
                .andExpect(status().isOk());
    }

    // ========================================
    // 5. 장비 삭제
    // ========================================
    @Test
    void 장비삭제() throws Exception {

        mockMvc.perform(
                        delete("/equipments/1")
                )
                .andExpect(status().isOk());
    }

    // ========================================
    // 6. 존재하지 않는 장비 조회
    // ========================================
    @Test
    void 존재하지않는장비조회() throws Exception {

        when(equipmentService.getEquipment(99999L))
                .thenThrow(
                        new EquipmentNotFoundException(
                                "장비를 찾을 수 없습니다."
                        )
                );

        mockMvc.perform(
                        get("/equipments/99999")
                )
                .andExpect(status().isNotFound());
    }

    // ========================================
    // 7. 존재하지 않는 장비 수정
    // ========================================
    @Test
    void 존재하지않는장비수정() throws Exception {

        String json = """
                {
                    "companyId": 1,
                    "categoryId": 1,
                    "eqNo": "EQ-99999",
                    "name": "없는 장비",
                    "type": "Bonder",
                    "status": "정상",
                    "location": "1공장",
                    "statusCodeId": 1,
                    "useYn": "Y"
                }
                """;

        when(equipmentService.updateEquipment(
                org.mockito.ArgumentMatchers.eq(99999L),
                org.mockito.ArgumentMatchers.any(
                        com.example.equipmentmanagement.equipment.dto.EquipmentRequest.class
                )
        )).thenThrow(
                new EquipmentNotFoundException(
                        "장비를 찾을 수 없습니다."
                )
        );

        mockMvc.perform(
                        put("/equipments/99999")
                                .contentType("application/json")
                                .content(json)
                )
                .andExpect(status().isNotFound());
    }

    // ========================================
    // 8. 존재하지 않는 장비 삭제
    // ========================================
    @Test
    void 존재하지않는장비삭제() throws Exception {

        org.mockito.Mockito.doThrow(
                new EquipmentNotFoundException(
                        "장비를 찾을 수 없습니다."
                )
        ).when(equipmentService).deleteEquipment(99999L);

        mockMvc.perform(
                        delete("/equipments/99999")
                )
                .andExpect(status().isNotFound());
    }
}