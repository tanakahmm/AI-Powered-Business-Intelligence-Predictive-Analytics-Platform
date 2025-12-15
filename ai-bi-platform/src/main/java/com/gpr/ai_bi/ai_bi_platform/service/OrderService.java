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
    private final com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
            StockRepository stockRepository, NotificationService notificationService, SaleRepository saleRepository,
            com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.notificationService = notificationService;
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Order placeOrder(Order order, String userEmail) {
        // Find or Create Customer Profile for this User
        com.gpr.ai_bi.ai_bi_platform.entity.Customer customer = customerRepository.findByEmail(userEmail)
                .orElseGet(() -> {
                    // Auto-create customer profile if missing
                    com.gpr.ai_bi.ai_bi_platform.entity.Customer newCustomer = new com.gpr.ai_bi.ai_bi_platform.entity.Customer();
                    newCustomer.setEmail(userEmail);
                    newCustomer.setName(userEmail.split("@")[0]); // Temporary name
                    newCustomer.setCreatedDate(LocalDate.now());
                    newCustomer.setStatus("Active");
                    return customerRepository.save(newCustomer);
                });

        order.setCustomer(customer);
        return placeOrder(order);
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
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;

        // Items should be provided in the order object
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item.");
        }

        for (com.gpr.ai_bi.ai_bi_platform.entity.OrderItem item : order.getItems()) {
            // 1. Validate Product
            Product product = productRepository.findById(item.getProduct().getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // 2. Check Stock
            Stock stock = stockRepository.findById(product.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Stock not found"));

            if (stock.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product " + product.getName() + ". Available: " + stock.getQuantity());
            }

            // 3. Deduct Stock
            stock.setQuantity(stock.getQuantity() - item.getQuantity());
            stockRepository.save(stock);

            // 4. Check Reorder Level
            if (stock.getQuantity() <= stock.getReorderLevel()) {
                notificationService.createNotification(
                        "STOCK",
                        "Low Stock Alert: " + product.getName() + " is below reorder level.",
                        "HIGH");
            }

            // Link item to order
            item.setOrder(order);
            item.setProduct(product); // Ensure product is set correctly if only ID was passed

            // Calculate financials for this item
            BigDecimal cost = product.getCostPrice() != null ? product.getCostPrice() : BigDecimal.ZERO;
            BigDecimal price = product.getSellingPrice() != null ? product.getSellingPrice() : BigDecimal.ZERO;

            BigDecimal itemRevenue = price.multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal itemCost = cost.multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal itemProfit = itemRevenue.subtract(itemCost);

            totalRevenue = totalRevenue.add(itemRevenue);
            totalProfit = totalProfit.add(itemProfit);
        }

        // 5. Save Order
        order.setOrderDate(LocalDate.now());
        order.setStatus("Completed");
        Order savedOrder = orderRepository.save(order);

        // 6. Record Sale (Aggregate)
        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setRevenue(totalRevenue);
        sale.setProfit(totalProfit);
        if (order.getCustomer() != null) {
            sale.setRegion(order.getCustomer().getCity());
        }
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
