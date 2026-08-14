package com.example.equipmentmanagement.ai;

import com.example.equipmentmanagement.ai.dto.AiAnalysisRequest;
import com.example.equipmentmanagement.ai.dto.AiAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AiFailureRepository aiFailureRepository;

    @Value("${openai.api-key}")
    private String apiKey;

    public AiAnalysisResponse analyzeFailure(
            AiAnalysisRequest request
    ) {

        // 1. DB에서 장애 정보 조회
        Map<String, Object> failure =
                aiFailureRepository.findFailureById(
                        request.getFailureId()
                );

        String content =
                String.valueOf(failure.get("CONTENT"));

        String failureType =
                String.valueOf(failure.get("FAILURE_TYPE"));

        String equipmentName =
                String.valueOf(failure.get("EQUIPMENT_NAME"));

        // 2. AI에게 보낼 질문
        String prompt = """
                다음은 공장 장비의 장애 정보입니다.

                장비명: %s
                장애 유형: %s
                장애 내용: %s

                위 장애를 분석해서 다음 형식으로 답변해주세요.

                [예상 원인]
                가능한 원인을 2~3개 설명

                [권장 조치]
                현장에서 수행할 수 있는 조치를 단계별로 설명

                [우선순위]
                낮음 / 보통 / 높음 중 하나

                기술자가 이해하기 쉽고 간결하게 작성해주세요.
                """.formatted(
                equipmentName,
                failureType,
                content
        );

        try {

            // 3. OpenAI API 요청 JSON
            String requestBody = """
                    {
                      "model": "gpt-4o-mini",
                      "messages": [
                        {
                          "role": "system",
                          "content": "당신은 공장 장비 장애 분석 전문가입니다."
                        },
                        {
                          "role": "user",
                          "content": %s
                        }
                      ]
                    }
                    """.formatted(
                    escapeJson(prompt)
            );

            HttpClient client =
                    HttpClient.newHttpClient();

            HttpRequest httpRequest =
                    HttpRequest.newBuilder()
                            .uri(URI.create(
                                    "https://api.openai.com/v1/chat/completions"
                            ))
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "Authorization",
                                    "Bearer " + apiKey
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(requestBody)
                            )
                            .build();

            // 4. OpenAI 호출
            HttpResponse<String> response =
                    client.send(
                            httpRequest,
                            HttpResponse.BodyHandlers.ofString()
                    );

            // 5. 응답 확인
            String responseBody = response.body();

            if (response.statusCode() != 200) {
                return new AiAnalysisResponse(
                        request.getFailureId(),
                        "AI 호출 실패: " + responseBody
                );
            }

            // 일단 전체 응답 확인
            return new AiAnalysisResponse(
                    request.getFailureId(),
                    responseBody
            );

        } catch (Exception e) {

            return new AiAnalysisResponse(
                    request.getFailureId(),
                    "AI 분석 중 오류 발생: " + e.getMessage()
            );
        }
    }

    private String escapeJson(String text) {

        return "\"" +
                text
                        .replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r") +
                "\"";
    }
}