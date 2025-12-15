package com.gpr.ai_bi.ai_bi_platform.controller;

import com.gpr.ai_bi.ai_bi_platform.entity.Report;
import com.gpr.ai_bi.ai_bi_platform.service.ReportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public Report createReport(@RequestParam String type, @RequestBody String data) {
        return reportService.createReport(type, data);
    }
}
