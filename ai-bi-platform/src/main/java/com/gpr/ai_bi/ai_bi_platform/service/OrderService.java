package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Order;
import com.gpr.ai_bi.ai_bi_platform.entity.Product;
import com.gpr.ai_bi.ai_bi_platform.entity.Stock;
import com.gpr.ai_bi.ai_bi_platform.repository.OrderRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.ProductRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import com.gpr.ai_bi.ai_bi_platform.entity.Sale;
import com.gpr.ai_bi.ai_bi_platform.repository.SaleRepository;
import java.math.BigDecimal;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;
    private final NotificationService notificationService;
    private final SaleRepository saleRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
            StockRepository stockRepository, NotificationService notificationService, SaleRepository saleRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.notificationService = notificationService;
        this.saleRepository = saleRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersForCustomer(Long customerId) {
        return orderRepository.findByCustomer_CustomerId(customerId);
    }

    public List<Order> getOrdersForUser(String email) {
        return orderRepository.findByCustomer_Email(email);
    }

    @Transactional
    public Order placeOrder(Order order) {
        // 1. Validate Product
        Product product = productRepository.findById(order.getProduct().getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Check Stock
        Stock stock = stockRepository.findById(product.getProductId())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        if (stock.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + stock.getQuantity());
        }

        // 3. Deduct Stock
        stock.setQuantity(stock.getQuantity() - order.getQuantity());
        stockRepository.save(stock);

        // 4. Check Reorder Level
        if (stock.getQuantity() <= stock.getReorderLevel()) {
            notificationService.createNotification(
                    "STOCK",
                    "Low Stock Alert: " + product.getName() + " is below reorder level.",
                    "HIGH");
        }

        // 5. Save Order
        order.setOrderDate(LocalDate.now());
        order.setStatus("Completed");
        Order savedOrder = orderRepository.save(order);

        // 6. Record Sale
        // Assuming simple model where 1 Order = 1 Product for now (based on Order
        // entity structure)
        // Ensure null checks for prices
        BigDecimal cost = product.getCostPrice() != null ? product.getCostPrice() : BigDecimal.ZERO;
        BigDecimal price = product.getSellingPrice() != null ? product.getSellingPrice() : BigDecimal.ZERO;

        BigDecimal revenue = price.multiply(BigDecimal.valueOf(order.getQuantity()));
        BigDecimal totalCost = cost.multiply(BigDecimal.valueOf(order.getQuantity()));
        BigDecimal profit = revenue.subtract(totalCost);

        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setRevenue(revenue);
        sale.setProfit(profit);
        sale.setRegion(order.getCustomer().getCity()); // Use Customer City as Region
        saleRepository.save(sale);

        return savedOrder;
    }

    public Order updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
