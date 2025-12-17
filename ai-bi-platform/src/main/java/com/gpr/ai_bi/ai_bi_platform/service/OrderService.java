package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Order;
import com.gpr.ai_bi.ai_bi_platform.entity.Product;
import com.gpr.ai_bi.ai_bi_platform.repository.OrderRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.ProductRepository;
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
    private final StockService stockService;
    private final SaleRepository saleRepository;
    private final com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository customerRepository;
    private final com.gpr.ai_bi.ai_bi_platform.repository.CustomerActivityRepository customerActivityRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
            StockService stockService, SaleRepository saleRepository,
            com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository customerRepository,
            com.gpr.ai_bi.ai_bi_platform.repository.CustomerActivityRepository customerActivityRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.stockService = stockService;
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
        this.customerActivityRepository = customerActivityRepository;
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
            System.out.println("OrderService: Order items are empty or null");
            throw new IllegalArgumentException("Order must contain at least one item.");
        }
        System.out.println("OrderService: Processing " + order.getItems().size() + " items");

        // Link items to order and validate/update stock
        for (com.gpr.ai_bi.ai_bi_platform.entity.OrderItem item : order.getItems()) {
            // 1. Validate Product
            Product product = productRepository.findById(item.getProduct().getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // 2. Reduce Stock (Delegate to StockService)
            stockService.reduceStock(product.getProductId(), item.getQuantity());

            // Link item to order
            item.setOrder(order);
            item.setProduct(product);

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
        order.setTotalAmount(totalRevenue); // Ensure total amount is set
        Order savedOrder = orderRepository.save(order);

        // 6. Record Sale (Aggregate) - CRITICAL FOR KPI
        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setRevenue(totalRevenue);
        sale.setProfit(totalProfit);
        if (order.getCustomer() != null) {
            sale.setRegion(order.getCustomer().getCity());

            // Log Activity
            try {
                com.gpr.ai_bi.ai_bi_platform.entity.CustomerActivity activity = new com.gpr.ai_bi.ai_bi_platform.entity.CustomerActivity();
                activity.setCustomer(order.getCustomer());
                activity.setActivityType("ORDER_PLACED");
                activity.setDescription("Order #" + savedOrder.getOrderId() + " placed for " + totalRevenue);
                activity.setActivityDate(java.time.LocalDateTime.now());
                customerActivityRepository.save(activity);
            } catch (Exception e) {
                // Log but don't fail transaction? Actually better to let it bubble if strict,
                // but for logging soft fail is okay.
                // However keeping it simple for now inside transaction.
            }

        } else {
            sale.setRegion("Unknown");
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
