package com.gpr.ai_bi.ai_bi_platform.repository;

import com.gpr.ai_bi.ai_bi_platform.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesRepository extends JpaRepository<Sale, Long> {
    @Query("SELECT SUM(s.revenue) FROM Sale s")
    Double getTotalRevenue();

    @Query("SELECT SUM(s.profit) FROM Sale s")
    Double getTotalProfit();

    @Query("SELECT COUNT(DISTINCT s.region) FROM Sale s")
    Long getRegionCount();
}
