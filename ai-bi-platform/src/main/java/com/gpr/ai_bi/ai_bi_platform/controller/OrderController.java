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
        String role = auth.getAuthorities().stream().findFirst().get().getAuthority();

        // If Customer, filter by their ID
        if (role.equals("ROLE_CUSTOMER") || role.equals("ROLE_USER")) {
            // In a real app, we'd extract Customer ID from the UserDetails or Token.
            // Since we don't have easy access to Customer ID here without a lookup or
            // expanding the Principal,
            // and for this specific task fixing 403 is priority, we will allow them to see
            // all for now OR better:
            // Lookup customer by email.

            // However, to keep it robust and not break:
            // Let's assume the Principal is the UserDetails which contains the email.
            // We can look up the customer by email.
            // But we need CustomerRepository or a Service method that does it.
            // Let's modify OrderService to handle "getOrdersForCurrentUser(email)".
            return orderService.getOrdersForUser(auth.getName());
        }

        return orderService.getAllOrders();
    }

    @PostMapping("/placeOrder")
    public Order placeOrder(@RequestBody Order order) {
        return orderService.placeOrder(order);
    }

    @PutMapping("/updateStatus/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }
}
