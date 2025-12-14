package com.gpr.ai_bi.ai_bi_platform.service;

import org.springframework.stereotype.Service;
import com.gpr.ai_bi.ai_bi_platform.model.DashboardSummary;

@Service
public class DashboardService {

    public DashboardSummary getSummary() {
        // Return demo data for now
        // TODO: Replace with actual database queries when data is available
        DashboardSummary summary = new DashboardSummary();
        summary.setRevenue("₹48,20,000");
        summary.setProfit("₹12,45,000");
        summary.setCustomers(1920);
        summary.setGrowth("21.4%");
        return summary;
    }
}
