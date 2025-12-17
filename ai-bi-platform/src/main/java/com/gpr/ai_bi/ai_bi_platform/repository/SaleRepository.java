package com.gpr.ai_bi.ai_bi_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gpr.ai_bi.ai_bi_platform.entity.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT SUM(s.revenue) FROM Sale s")
    java.math.BigDecimal sumTotalRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(s.profit) FROM Sale s")
    java.math.BigDecimal sumTotalProfit();

    @org.springframework.data.jpa.repository.Query("SELECT s.region, SUM(s.revenue) FROM Sale s GROUP BY s.region")
    java.util.List<Object[]> findSalesByRegion();
}
