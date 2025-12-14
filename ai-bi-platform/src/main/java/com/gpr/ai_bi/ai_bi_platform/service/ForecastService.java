package com.gpr.ai_bi.ai_bi_platform.service;

import org.springframework.web.client.RestTemplate;
import java.util.Map;
import org.springframework.stereotype.Service;
@Service
public class ForecastService {
    private final RestTemplate restTemplate;

    public ForecastService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> getForecast(int months) {

        String url = "http://localhost:8000/predict-forecast?months=" + months;

        return restTemplate.getForObject(url, Map.class);
    }
}


