package com.gpr.ai_bi.ai_bi_platform.controller;

import com.gpr.ai_bi.ai_bi_platform.entity.SalesForecast;
import com.gpr.ai_bi.ai_bi_platform.service.ForecastService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "*")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping("/predict")
    public Map<String, Object> forecast(@RequestParam(defaultValue = "3") int months,
            @RequestParam(defaultValue = "STABLE") String trend) {
        return forecastService.getForecast(months, trend);
    }

    @PostMapping
    public SalesForecast createForecast(@RequestBody SalesForecast forecast) {
        return forecastService.createForecast(forecast);
    }

    @GetMapping
    public java.util.List<SalesForecast> getAllForecasts() {
        return forecastService.getAllForecasts();
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteForecast(@PathVariable Long id) {
        forecastService.deleteForecast(id);
    }
}