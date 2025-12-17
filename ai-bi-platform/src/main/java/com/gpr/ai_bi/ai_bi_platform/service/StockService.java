package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Product;
import com.gpr.ai_bi.ai_bi_platform.entity.Stock;
import com.gpr.ai_bi.ai_bi_platform.repository.ProductRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    public StockService(StockRepository stockRepository, ProductRepository productRepository,
            NotificationService notificationService) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockByProductId(Long productId) {
        return stockRepository.findById(productId);
    }

    @Transactional
    public Stock updateStock(Long productId, Integer quantity) {
        Stock stock = stockRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Stock not found for product id: " + productId));

        stock.setQuantity(quantity);
        Stock savedStock = stockRepository.save(stock);

        // Check for low stock
        checkLowStock(savedStock);

        return savedStock;
    }

    @Transactional
    public void reduceStock(Long productId, Integer quantityToReduce) {
        Stock stock = stockRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Stock not found for product id: " + productId));

        if (stock.getQuantity() < quantityToReduce) {
            Optional<Product> product = productRepository.findById(productId);
            String productName = product.map(Product::getName).orElse("Unknown Product");
            throw new IllegalArgumentException(
                    "Insufficient stock for product " + productName + ". Available: " + stock.getQuantity());
        }

        stock.setQuantity(stock.getQuantity() - quantityToReduce);
        Stock savedStock = stockRepository.save(stock);

        checkLowStock(savedStock);
    }

    private void checkLowStock(Stock stock) {
        if (stock.getQuantity() <= stock.getReorderLevel()) {
            Optional<Product> product = productRepository.findById(stock.getProductId());
            String productName = product.map(Product::getName).orElse("Unknown Product");

            notificationService.createNotification(
                    "STOCK",
                    "Low stock alert: " + productName + " is below reorder level (" + stock.getQuantity()
                            + " remaining).",
                    "HIGH");
        }
    }
}
