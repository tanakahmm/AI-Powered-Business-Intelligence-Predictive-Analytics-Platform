package com.gpr.ai_bi.ai_bi_platform.service;

import org.springframework.web.client.RestTemplate;
import java.util.Map;
import org.springframework.stereotype.Service;
@Service
public class ChurnService {
    private final RestTemplate restTemplate;

    public ChurnService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> predictChurn(Map<String, Object> input) {

        String pythonUrl = "http://localhost:8000/predict-churn";

        // Send request to Python AI service
        Map<String, Object> response =
                restTemplate.postForObject(pythonUrl, input, Map.class);

        return response;
    }
}
