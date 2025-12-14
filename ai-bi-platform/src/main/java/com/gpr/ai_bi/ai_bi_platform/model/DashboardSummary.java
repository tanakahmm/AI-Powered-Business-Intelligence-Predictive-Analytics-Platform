package com.gpr.ai_bi.ai_bi_platform.model;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummary {
    private String revenue;
    private String profit;
    private Integer customers;
    private String growth;
}
