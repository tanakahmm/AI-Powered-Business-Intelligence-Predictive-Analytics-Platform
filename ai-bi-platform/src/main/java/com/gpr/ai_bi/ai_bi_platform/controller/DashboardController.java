package com.gpr.ai_bi.ai_bi_platform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.gpr.ai_bi.ai_bi_platform.model.DashboardSummary;
import com.gpr.ai_bi.ai_bi_platform.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin // allow mobile/web clients
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummary getSummary() {
        return dashboardService.getSummary();
}
}
