package com.gpr.ai_bi.ai_bi_platform.controller;

import com.gpr.ai_bi.ai_bi_platform.entity.Order;
import com.gpr.ai_bi.ai_bi_platform.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/getAllOrders")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CUSTOMER')")
    public List<Order> getAllOrders() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .orElse("ROLE_CUSTOMER"); // Default fallback

        // Debug log
        System.out.println("Fetching orders for user: " + auth.getName() + " with role: " + role);

        if ("ROLE_ADMIN".equals(role) || "ROLE_ANALYST".equals(role)) {
            return orderService.getAllOrders();
        } else {
            // For CUSTOMER and others, strictly filter by their email
            return orderService.getOrdersForUser(auth.getName());
        }
    }

    @PostMapping("/placeOrder")
    public Order placeOrder(@RequestBody Order order) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        return orderService.placeOrder(order, auth.getName());
    }

    @PutMapping("/updateStatus/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }
}
