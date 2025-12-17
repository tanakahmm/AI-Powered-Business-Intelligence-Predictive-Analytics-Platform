package com.gpr.ai_bi.ai_bi_platform.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public Map<String, Object> getSummary() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .orElse("ROLE_CUSTOMER");

        return dashboardService.getDashboardSummary(auth.getName(), role);
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @GetMapping("/metrics")
    public Map<String, Object> getMetrics() {
        return dashboardService.getMetrics();
    }
}
