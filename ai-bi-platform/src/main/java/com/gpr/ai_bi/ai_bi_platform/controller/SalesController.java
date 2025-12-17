package com.gpr.ai_bi.ai_bi_platform.controller;

import com.gpr.ai_bi.ai_bi_platform.entity.Order;
import com.gpr.ai_bi.ai_bi_platform.entity.Sale;
import com.gpr.ai_bi.ai_bi_platform.service.SalesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @GetMapping("/history")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    public List<Sale> getSalesHistory() {
        return salesService.getAllSales();
    }

    @GetMapping("/orders")
    public List<Order> getRecentOrders() {
        return salesService.getAllOrders();
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public Sale createSale(@RequestBody Sale sale) {
        return salesService.createSale(sale);
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteSale(@PathVariable Long id) {
        salesService.deleteSale(id);
    }
}
