package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Sale;
import com.gpr.ai_bi.ai_bi_platform.entity.Order;
import com.gpr.ai_bi.ai_bi_platform.repository.SaleRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesService {

    private final SaleRepository saleRepository;
    private final OrderRepository orderRepository;

    public SalesService(SaleRepository saleRepository, OrderRepository orderRepository) {
        this.saleRepository = saleRepository;
        this.orderRepository = orderRepository;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Sale createSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }
}
