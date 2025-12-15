package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Product;
import com.gpr.ai_bi.ai_bi_platform.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final com.gpr.ai_bi.ai_bi_platform.repository.StockRepository stockRepository;

    public ProductService(ProductRepository productRepository,
            com.gpr.ai_bi.ai_bi_platform.repository.StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @org.springframework.transaction.annotation.Transactional
    public Product createProduct(com.gpr.ai_bi.ai_bi_platform.dto.ProductRequest request) {
        // Map DTO to Entity
        Product product = new Product();
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setCostPrice(request.getCostPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setActive(request.getActive());

        // Save Product
        Product savedProduct = productRepository.save(product);

        // Initialize Stock for this Product
        com.gpr.ai_bi.ai_bi_platform.entity.Stock stock = new com.gpr.ai_bi.ai_bi_platform.entity.Stock();
        stock.setProductId(savedProduct.getProductId());

        // Use provided initial stock or default to 0
        int initialStock = request.getInitialStock() != null ? request.getInitialStock() : 0;
        stock.setQuantity(initialStock);

        stock.setReorderLevel(10); // Default reorder level
        stock.setLastUpdated(java.time.LocalDateTime.now());
        stockRepository.save(stock);

        return savedProduct;
    }
}
