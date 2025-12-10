package com.gpr.ai_bi.ai_bi_platform.service;

import org.springframework.stereotype.Service;
import com.gpr.ai_bi.ai_bi_platform.repository.SalesRepository;
import com.gpr.ai_bi.ai_bi_platform.model.DashboardSummary;

@Service
public class DashboardService {
    private final SalesRepository salesRepository;

    public DashboardService(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    public DashboardSummary getSummary() {
        Double totalRevenue = salesRepository.getTotalRevenue();
        Double totalProfit = salesRepository.getTotalProfit();
        Long regionCount = salesRepository.getRegionCount();

        DashboardSummary summary = new DashboardSummary();
        summary.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        summary.setTotalProfit(totalProfit != null ? totalProfit : 0.0);
        summary.setRegionCount(regionCount != null ? regionCount : 0L);
        return summary;
    }
}
