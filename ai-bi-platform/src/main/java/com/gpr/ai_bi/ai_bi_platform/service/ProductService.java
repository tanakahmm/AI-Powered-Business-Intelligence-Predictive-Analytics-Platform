package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Product;
import com.gpr.ai_bi.ai_bi_platform.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}
