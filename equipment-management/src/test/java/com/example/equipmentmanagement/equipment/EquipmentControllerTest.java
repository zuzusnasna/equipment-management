package com.example.equipmentmanagement.equipment;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EquipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EquipmentRepository equipmentRepository;


    @Test
    void 전체장비조회() throws Exception {

        mockMvc.perform(
                        get("/equipments")
                )
                .andExpect(status().isOk());
    }


    @Test
    @DisplayName("장비 단건 조회 성공")
    void 장비단건조회() throws Exception {

        Equipment equipment = new Equipment();

        equipment.setName("조회할 장비");
        equipment.setType("Bonder");
        equipment.setStatus("정상");
        equipment.setLocation("1공장");

        Equipment savedEquipment = equipmentRepository.save(equipment);

        mockMvc.perform(
                        get("/equipments/" + savedEquipment.getId())
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedEquipment.getId()))
                .andExpect(jsonPath("$.name").value("조회할 장비"))
                .andExpect(jsonPath("$.type").value("Bonder"))
                .andExpect(jsonPath("$.status").value("정상"))
                .andExpect(jsonPath("$.location").value("1공장"));
    }


    @Test
    void 장비등록() throws Exception {

        String request = """
                {
                    "name": "TC Bonder 3",
                    "type": "Bonder",
                    "status": "정상",
                    "location": "3공장"
                }
                """;

        mockMvc.perform(
                        post("/equipments")
                                .contentType(APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("TC Bonder 3"))
                .andExpect(jsonPath("$.type").value("Bonder"))
                .andExpect(jsonPath("$.status").value("정상"))
                .andExpect(jsonPath("$.location").value("3공장"));
    }


    @Test
    @DisplayName("장비 수정 성공")
    void 장비수정() throws Exception {

        Equipment equipment = new Equipment();

        equipment.setName("수정 전 장비");
        equipment.setType("Bonder");
        equipment.setStatus("정상");
        equipment.setLocation("1공장");

        Equipment savedEquipment = equipmentRepository.save(equipment);

        String request = """
            {
                "name": "TC Bonder 수정",
                "type": "Bonder",
                "status": "점검중",
                "location": "2공장"
            }
            """;

        mockMvc.perform(
                        put("/equipments/" + savedEquipment.getId())
                                .contentType(APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedEquipment.getId()))
                .andExpect(jsonPath("$.name").value("TC Bonder 수정"))
                .andExpect(jsonPath("$.type").value("Bonder"))
                .andExpect(jsonPath("$.status").value("점검중"))
                .andExpect(jsonPath("$.location").value("2공장"));
    }


    @Test
    @DisplayName("장비 삭제 성공")
    void 장비삭제() throws Exception {

        // given
        Equipment equipment = new Equipment();

        equipment.setName("삭제할 장비");
        equipment.setType("PC");
        equipment.setLocation("1층");
        equipment.setStatus("사용중");

        Equipment savedEquipment = equipmentRepository.save(equipment);

        // when & then
        mockMvc.perform(
                        delete("/equipments/" + savedEquipment.getId())
                )
                .andExpect(status().isOk());

        // 삭제되었는지 확인
        assertThat(
                equipmentRepository.findById(savedEquipment.getId())
        ).isEmpty();
    }
    @Test
    @DisplayName("존재하지 않는 장비 삭제 실패")
    void 존재하지않는장비삭제() throws Exception {

        mockMvc.perform(
                        delete("/equipments/999999")
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("장비를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.status").value(404));
    }
    @Test
    @DisplayName("존재하지 않는 장비 조회 실패")
    void 존재하지않는장비조회() throws Exception {

        mockMvc.perform(
                        get("/equipments/999999")
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("장비를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.status").value(404));
    }
    @Test
    @DisplayName("존재하지 않는 장비 수정 실패")
    void 존재하지않는장비수정() throws Exception {

        String request = """
            {
                "name": "수정할 장비",
                "type": "Bonder",
                "status": "점검중",
                "location": "2공장"
            }
            """;

        mockMvc.perform(
                        put("/equipments/999999")
                                .contentType(APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("장비를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.status").value(404));
    }
}