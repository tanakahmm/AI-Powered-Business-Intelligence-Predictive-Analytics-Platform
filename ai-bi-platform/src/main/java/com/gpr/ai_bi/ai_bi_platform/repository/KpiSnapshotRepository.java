package com.gpr.ai_bi.ai_bi_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gpr.ai_bi.ai_bi_platform.entity.KpiSnapshot;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface KpiSnapshotRepository extends JpaRepository<KpiSnapshot, Long> {
    Optional<KpiSnapshot> findBySnapshotDate(LocalDate date);
}
