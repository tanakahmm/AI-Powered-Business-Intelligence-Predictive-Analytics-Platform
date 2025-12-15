
package com.gpr.ai_bi.ai_bi_platform.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "churn_predictions")
@Getter
@Setter
public class ChurnPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long predictionId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private Double churnProbability;
    private String riskLevel;

    @CreationTimestamp
    private LocalDateTime predictedOn;
}
