package com.gpr.ai_bi.ai_bi_platform.repository;
import com.gpr.ai_bi.ai_bi_platform.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SalesRepository extends JpaRepository<Sales, Long> {
    @Query("SELECT SUM(s.revenue) FROM Sales s")
    Double getTotalRevenue();

    @Query("SELECT SUM(s.profit) FROM Sales s")
    Double getTotalProfit();

    @Query("SELECT COUNT(DISTINCT s.region) FROM Sales s")
    Long getRegionCount();
}
