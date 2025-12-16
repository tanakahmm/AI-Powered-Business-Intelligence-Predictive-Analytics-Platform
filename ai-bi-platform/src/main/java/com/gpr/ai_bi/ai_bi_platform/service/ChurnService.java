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

        try {
            // Send request to Python AI service
            return restTemplate.postForObject(pythonUrl, input, Map.class);
        } catch (Exception e) {
            // Fallback: Return mock prediction
            // Fallback: Smart Mock based on rudimentary logic
            int complaints = 0;
            if (input.containsKey("complaints")) {
                try {
                    complaints = Integer.parseInt(input.get("complaints").toString());
                } catch (NumberFormatException ex) {
                }
            }

            double probability = 0.10 + (complaints * 0.15); // Increase risk with complaints
            if (probability > 0.95)
                probability = 0.95;

            String risk = "LOW";
            String action = "Keep engaging with standard offers.";

            if (probability > 0.4) {
                risk = "MEDIUM";
                action = "Send personalized discount coupon (10%).";
            }
            if (probability > 0.7) {
                risk = "HIGH";
                action = "Urgent: Assign account manager & offer 20% retention discount.";
            }

            return Map.of(
                    "churn_probability", probability,
                    "risk_level", risk,
                    "recommended_action", action,
                    "message", "Generated from fallback (AI service unavailable - Smart Mock)");
        }
    }
}
