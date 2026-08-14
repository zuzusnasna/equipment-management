package com.example.equipmentmanagement.ai;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class AiFailureRepository {

    private final JdbcTemplate jdbcTemplate;

    public AiFailureRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> findFailureById(Long failureId) {

        String sql = """
                SELECT
                    f.FAILURE_ID,
                    f.EQUIPMENT_ID,
                    e.EQ_NO,
                    e.NAME AS EQUIPMENT_NAME,
                    e.TYPE AS EQUIPMENT_TYPE,
                    e.LOCATION,
                    f.REPORTER_ID,
                    f.TYPE_CODE_ID,
                    ft.NAME AS FAILURE_TYPE,
                    f.CONTENT,
                    f.OCCURRED_AT,
                    f.STATUS_CODE_ID,
                    fs.NAME AS FAILURE_STATUS
                FROM FAILURE f

                JOIN EQUIPMENT e
                    ON f.EQUIPMENT_ID = e.EQUIPMENT_ID

                LEFT JOIN COMMON_CODE ft
                    ON f.TYPE_CODE_ID = ft.CODE_ID

                LEFT JOIN COMMON_CODE fs
                    ON f.STATUS_CODE_ID = fs.CODE_ID

                WHERE f.FAILURE_ID = ?
                """;

        return jdbcTemplate.queryForMap(sql, failureId);
    }
}