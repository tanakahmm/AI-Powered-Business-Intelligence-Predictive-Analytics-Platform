package com.gpr.ai_bi.ai_bi_platform.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.gpr.ai_bi.ai_bi_platform.service.ChurnService;

import java.util.Map;

@RestController
@RequestMapping("/api/churn")
@CrossOrigin
public class ChurnController {
    private final ChurnService churnService;

    public ChurnController(ChurnService churnService) {
        this.churnService = churnService;
    }

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody Map<String, Object> input) {
        return churnService.predictChurn(input);
    }
}
