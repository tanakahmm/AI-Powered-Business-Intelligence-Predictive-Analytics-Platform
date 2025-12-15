package com.gpr.ai_bi.ai_bi_platform.controller;

import com.gpr.ai_bi.ai_bi_platform.entity.Stock;
import com.gpr.ai_bi.ai_bi_platform.service.StockService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{productId}")
    public Stock getStockByProduct(@PathVariable Long productId) {
        return stockService.getStockByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public Stock updateStock(@PathVariable Long productId, @RequestParam Integer quantity) {
        return stockService.updateStock(productId, quantity);
    }
}
