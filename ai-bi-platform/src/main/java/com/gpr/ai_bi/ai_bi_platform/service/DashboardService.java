package com.gpr.ai_bi.ai_bi_platform.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.gpr.ai_bi.ai_bi_platform.entity.Sale;
import com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.OrderRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.ProductRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.SaleRepository;

@Service
public class DashboardService {

        private final CustomerRepository customerRepository;
        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final SaleRepository saleRepository;
        private final com.gpr.ai_bi.ai_bi_platform.repository.KpiSnapshotRepository kpiSnapshotRepository;

        public DashboardService(
                        CustomerRepository customerRepository,
                        OrderRepository orderRepository,
                        ProductRepository productRepository,
                        SaleRepository saleRepository,
                        com.gpr.ai_bi.ai_bi_platform.repository.KpiSnapshotRepository kpiSnapshotRepository) {
                this.customerRepository = customerRepository;
                this.orderRepository = orderRepository;
                this.productRepository = productRepository;
                this.saleRepository = saleRepository;
                this.kpiSnapshotRepository = kpiSnapshotRepository;
        }

        public Map<String, Object> getDashboardSummary() {
                // Role based split
                org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                                .getContext().getAuthentication();

                boolean isCustomer = auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"));

                if (isCustomer) {
                        return getCustomerDashboard(auth.getName());
                } else {
                        return getBusinessDashboard();
                }
        }

        private Map<String, Object> getCustomerDashboard(String email) {
                Map<String, Object> summary = new HashMap<>();
                // For customer, show their own order stats
                long totalOrders = orderRepository.findByCustomer_Email(email).size();
                summary.put("myTotalOrders", totalOrders);
                summary.put("activeCustomers", 0); // Hide
                summary.put("totalRevenue", BigDecimal.ZERO); // Hide
                // Add more relevant customer fields if needed
                return summary;
        }

        private Map<String, Object> getBusinessDashboard() {
                Map<String, Object> summary = new HashMap<>();

                // Total counts
                long totalCustomers = customerRepository.count();
                long totalOrders = orderRepository.count();
                long totalProducts = productRepository.count();
                long totalSales = saleRepository.count();

                // Active customers
                long activeCustomers = customerRepository.findAll().stream()
                                .filter(c -> "ACTIVE".equals(c.getStatus()))
                                .count();

                // Total revenue
                BigDecimal totalRevenue = saleRepository.findAll().stream()
                                .map(Sale::getRevenue)
                                .filter(revenue -> revenue != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Total profit
                BigDecimal totalProfit = saleRepository.findAll().stream()
                                .map(Sale::getProfit)
                                .filter(profit -> profit != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Sales by region
                Map<String, BigDecimal> salesByRegion = saleRepository.findAll().stream()
                                .collect(Collectors.groupingBy(
                                                Sale::getRegion,
                                                Collectors.reducing(BigDecimal.ZERO, Sale::getRevenue,
                                                                BigDecimal::add)));

                // Recent orders
                List<Map<String, Object>> recentOrders = orderRepository.findAll().stream()
                                .limit(5)
                                .map(order -> {
                                        Map<String, Object> orderMap = new HashMap<>();
                                        orderMap.put("orderId", order.getOrderId());
                                        orderMap.put("customerName", order.getCustomer().getName());
                                        orderMap.put("orderDate", order.getOrderDate());
                                        orderMap.put("status", order.getStatus());
                                        return orderMap;
                                })
                                .collect(Collectors.toList());

                summary.put("totalCustomers", totalCustomers);
                summary.put("activeCustomers", activeCustomers);
                summary.put("totalOrders", totalOrders);
                summary.put("totalProducts", totalProducts);
                summary.put("totalSales", totalSales);
                summary.put("totalRevenue", totalRevenue);
                summary.put("totalProfit", totalProfit);
                summary.put("salesByRegion", salesByRegion);
                summary.put("recentOrders", recentOrders);

                return summary;
        }

        public Map<String, Object> getMetrics() {
                Map<String, Object> metrics = new HashMap<>();

                // 1. Total Counts
                long totalCustomers = customerRepository.count();
                long totalOrders = orderRepository.count();

                // 2. Financials
                BigDecimal totalRevenue = saleRepository.findAll().stream()
                                .map(Sale::getRevenue)
                                .filter(r -> r != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalProfit = saleRepository.findAll().stream()
                                .map(Sale::getProfit)
                                .filter(p -> p != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // 3. AOV
                BigDecimal averageOrderValue = totalOrders > 0
                                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO;

                // 4. Profit Margin %
                BigDecimal profitMargin = totalRevenue.compareTo(BigDecimal.ZERO) > 0
                                ? totalProfit.divide(totalRevenue, 4, RoundingMode.HALF_UP)
                                                .multiply(BigDecimal.valueOf(100))
                                : BigDecimal.ZERO;

                // 5. Active Customers
                long activeCustomers = customerRepository.findAll().stream()
                                .filter(c -> "ACTIVE".equals(c.getStatus()))
                                .count();

                // 6. Churn Rate (Simulated: Inactive / Total)
                long inactiveCustomers = totalCustomers - activeCustomers;
                BigDecimal churnRate = totalCustomers > 0
                                ? BigDecimal.valueOf(inactiveCustomers)
                                                .divide(BigDecimal.valueOf(totalCustomers), 4, RoundingMode.HALF_UP)
                                                .multiply(BigDecimal.valueOf(100))
                                : BigDecimal.ZERO;

                // 7. Monthly Growth (Simulated for demo)
                BigDecimal monthlyGrowth = BigDecimal.valueOf(15.5); // Mocked for now

                metrics.put("totalCustomers", totalCustomers);
                metrics.put("totalRevenue", totalRevenue);
                metrics.put("totalOrders", totalOrders);
                metrics.put("averageOrderValue", averageOrderValue);
                metrics.put("totalProfit", totalProfit);
                metrics.put("profitMargin", profitMargin);
                metrics.put("activeCustomers", activeCustomers);
                metrics.put("churnRate", churnRate);
                metrics.put("monthlyGrowth", monthlyGrowth);

                return metrics;
        }

        @org.springframework.transaction.annotation.Transactional
        public void captureDailySnapshot() {
                // Calculate daily totals
                BigDecimal totalRevenue = saleRepository.findAll().stream()
                                .map(Sale::getRevenue)
                                .filter(r -> r != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalProfit = saleRepository.findAll().stream()
                                .map(Sale::getProfit)
                                .filter(p -> p != null)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                long activeCustomers = customerRepository.findAll().stream()
                                .filter(c -> "ACTIVE".equals(c.getStatus()))
                                .count();

                long totalOrders = orderRepository.count();

                // Check if snapshot exists for today
                com.gpr.ai_bi.ai_bi_platform.entity.KpiSnapshot snapshot = kpiSnapshotRepository
                                .findBySnapshotDate(java.time.LocalDate.now())
                                .orElse(new com.gpr.ai_bi.ai_bi_platform.entity.KpiSnapshot());

                snapshot.setSnapshotDate(java.time.LocalDate.now());
                snapshot.setTotalRevenue(totalRevenue);
                snapshot.setTotalProfit(totalProfit);
                snapshot.setActiveCustomers(activeCustomers);
                snapshot.setTotalOrders(totalOrders);

                kpiSnapshotRepository.save(snapshot);
        }
}
