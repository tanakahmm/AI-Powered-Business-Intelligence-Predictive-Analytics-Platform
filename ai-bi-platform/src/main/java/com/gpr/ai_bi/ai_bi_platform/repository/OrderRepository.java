package com.gpr.ai_bi.ai_bi_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gpr.ai_bi.ai_bi_platform.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.List<Order> findByCustomer_CustomerId(Long customerId);

    java.util.List<Order> findByCustomer_Email(String email);
}
