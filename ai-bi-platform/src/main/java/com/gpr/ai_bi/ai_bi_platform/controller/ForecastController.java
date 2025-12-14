package com.gpr.ai_bi.ai_bi_platform.controller;

import java.util.HashMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin
public class ForecastController {
    @GetMapping("/predict")
    public Map<String, Object> forecast(@RequestParam(defaultValue = "3") int months) {
        Map<String, Object> res = new HashMap<>();
        res.put("predicted_sales", List.of(720000.0, 740000.0, 760000.0));
        res.put("trend", "UPWARD");
        return res;
    }
}