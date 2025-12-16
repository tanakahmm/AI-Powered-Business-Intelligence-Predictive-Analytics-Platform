
package com.gpr.ai_bi.ai_bi_platform.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer_activity")
public class CustomerActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    @jakarta.persistence.ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String activityType; // LOGIN, ORDER, etc.
    private String description;
    private java.time.LocalDateTime activityDate;

    // Legacy fields (optional, can be deprecated or used for snapshots)
    private LocalDate lastPurchaseDate;
    private Integer totalOrders;
    private BigDecimal totalSpent;
    private Integer complaints;

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getLastPurchaseDate() {
        return lastPurchaseDate;
    }

    public void setLastPurchaseDate(LocalDate lastPurchaseDate) {
        this.lastPurchaseDate = lastPurchaseDate;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Integer getComplaints() {
        return complaints;
    }

    public void setComplaints(Integer complaints) {
        this.complaints = complaints;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public java.time.LocalDateTime getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(java.time.LocalDateTime activityDate) {
        this.activityDate = activityDate;
    }

}
