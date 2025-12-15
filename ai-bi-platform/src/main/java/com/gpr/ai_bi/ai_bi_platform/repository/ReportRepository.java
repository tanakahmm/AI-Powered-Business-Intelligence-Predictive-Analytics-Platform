package com.gpr.ai_bi.ai_bi_platform.repository;

import com.gpr.ai_bi.ai_bi_platform.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportType(String reportType);

    List<Report> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
}
