package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Report;
import com.gpr.ai_bi.ai_bi_platform.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report createReport(String type, String data) {
        Report report = new Report();
        report.setReportType(type);
        report.setData(data);
        report.setStartDate(LocalDate.now().minusDays(30)); // Default to last 30 days
        report.setEndDate(LocalDate.now());
        return reportRepository.save(report);
    }
}
