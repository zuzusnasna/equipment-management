package com.example.equipmentmanagement.ai;

import com.example.equipmentmanagement.ai.dto.AiAnalysisRequest;
import com.example.equipmentmanagement.ai.dto.AiAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/failure-analysis")
    public ResponseEntity<AiAnalysisResponse> analyzeFailure(
            @RequestBody AiAnalysisRequest request
    ) {

        return ResponseEntity.ok(
                aiService.analyzeFailure(request)
        );
    }
}