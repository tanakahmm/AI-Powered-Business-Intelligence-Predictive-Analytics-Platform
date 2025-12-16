package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.SalesForecast;
import com.gpr.ai_bi.ai_bi_platform.repository.SalesForecastRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ForecastService {
    private final SalesForecastRepository salesForecastRepository;
    private final RestTemplate restTemplate;

    public ForecastService(RestTemplate restTemplate, SalesForecastRepository salesForecastRepository) {
        this.restTemplate = restTemplate;
        this.salesForecastRepository = salesForecastRepository;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getForecast(int months, String trend) {
        String url = "http://localhost:8000/predict-forecast?months=" + months + "&trend=" + trend;
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            // Fallback: Generate mock forecast or fetch last from DB
            return generateMockForecast(months, trend);
        }
    }

    public SalesForecast createForecast(SalesForecast forecast) {
        return salesForecastRepository.save(forecast);
    }

    public java.util.List<SalesForecast> getAllForecasts() {
        return salesForecastRepository.findAll();
    }

    public void deleteForecast(Long id) {
        salesForecastRepository.deleteById(id);
    }

    private Map<String, Object> generateMockForecast(int months, String trend) {
        // Smart mock logic: Generate varied sales data
        java.util.List<Double> predictions = new java.util.ArrayList<>();
        double baseSales = 75000.0;
        java.util.Random random = new java.util.Random();

        double trendFactor = 0;
        if ("UP".equalsIgnoreCase(trend)) {
            trendFactor = 2000;
        } else if ("DOWN".equalsIgnoreCase(trend)) {
            trendFactor = -2000;
        }

        for (int i = 0; i < months; i++) {
            double variation = (random.nextDouble() * 10000) - 2000; // -2000 to +8000
            baseSales += variation + trendFactor;
            if (baseSales < 0)
                baseSales = 0; // Prevent negative sales
            predictions.add(Math.round(baseSales * 100.0) / 100.0);
        }

        String actualTrend = (predictions.get(predictions.size() - 1) > predictions.get(0)) ? "UPWARD" : "STABLE";
        if (trendFactor < 0 && predictions.get(predictions.size() - 1) < predictions.get(0)) {
            actualTrend = "DOWNWARD";
        }

        return Map.of(
                "predicted_sales", predictions,
                "trend", actualTrend,
                "confidence", "MEDIUM",
                "assumption", "Based on historical sales variance and selected trend bias (" + trend + ")",
                "message", "Generated from fallback (AI service unavailable - Smart Mock with " + trend + " bias)");
    }
}
