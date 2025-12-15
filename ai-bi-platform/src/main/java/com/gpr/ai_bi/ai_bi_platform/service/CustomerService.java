package com.gpr.ai_bi.ai_bi_platform.service;

import com.gpr.ai_bi.ai_bi_platform.entity.Customer;
import com.gpr.ai_bi.ai_bi_platform.entity.CustomerActivity;
import com.gpr.ai_bi.ai_bi_platform.repository.CustomerActivityRepository;
import com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerActivityRepository customerActivityRepository;

    public CustomerService(CustomerRepository customerRepository,
            CustomerActivityRepository customerActivityRepository) {
        this.customerRepository = customerRepository;
        this.customerActivityRepository = customerActivityRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setCity(customerDetails.getCity());
        customer.setState(customerDetails.getState());
        customer.setStatus(customerDetails.getStatus());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public List<CustomerActivity> getCustomerActivities(Long customerId) {
        // Ideally we should use a custom query in the repository:
        // findByCustomer_CustomerId
        // For now, filtering the stream as a fallback if the method isn't in repo
        return customerActivityRepository.findAll().stream()
                .filter(a -> a.getCustomer() != null && a.getCustomer().getCustomerId().equals(customerId))
                .toList();
    }
}
