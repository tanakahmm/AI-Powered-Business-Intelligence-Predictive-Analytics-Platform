package com.gpr.ai_bi.ai_bi_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gpr.ai_bi.ai_bi_platform.entity.CustomerActivity;

@Repository
public interface CustomerActivityRepository extends JpaRepository<CustomerActivity, Long> {
}
