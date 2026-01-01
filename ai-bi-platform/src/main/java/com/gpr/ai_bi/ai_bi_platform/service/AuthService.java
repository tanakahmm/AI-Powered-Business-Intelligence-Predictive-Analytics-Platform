package com.gpr.ai_bi.ai_bi_platform.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gpr.ai_bi.ai_bi_platform.dto.LoginRequest;
import com.gpr.ai_bi.ai_bi_platform.dto.LoginResponse;
import com.gpr.ai_bi.ai_bi_platform.dto.RegisterRequest;
import com.gpr.ai_bi.ai_bi_platform.entity.AppUser;
import com.gpr.ai_bi.ai_bi_platform.repository.UserRepository;
import com.gpr.ai_bi.ai_bi_platform.security.JwtUtil;

import com.gpr.ai_bi.ai_bi_platform.entity.Customer;
import com.gpr.ai_bi.ai_bi_platform.repository.CustomerRepository;
import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final com.gpr.ai_bi.ai_bi_platform.repository.CustomerActivityRepository customerActivityRepository;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil, AuthenticationManager authenticationManager,
            com.gpr.ai_bi.ai_bi_platform.repository.CustomerActivityRepository customerActivityRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.customerActivityRepository = customerActivityRepository;
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        Long customerId = null;

        // Try to find associated customer
        java.util.Optional<Customer> customer = customerRepository.findByEmail(user.getEmail());

        if (customer.isPresent()) {
            customerId = customer.get().getCustomerId();

            // Log Activity
            com.gpr.ai_bi.ai_bi_platform.entity.CustomerActivity activity = new com.gpr.ai_bi.ai_bi_platform.entity.CustomerActivity();
            activity.setCustomer(customer.get());
            activity.setActivityType("LOGIN");
            activity.setDescription("User logged in successfully");
            activity.setActivityDate(java.time.LocalDateTime.now());
            customerActivityRepository.save(activity);
        }

        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole(), customerId);
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "USER");

        userRepository.save(user);

        // Auto-create Customer if role is CUSTOMER (or legacy USER)
        Long customerId = null;
        String role = user.getRole().toUpperCase();
        if ("CUSTOMER".equals(role) || "USER".equals(role)) {
            Customer customer = new Customer();
            customer.setName(user.getName());
            customer.setEmail(user.getEmail());
            customer.setCreatedDate(LocalDate.now());
            customer.setStatus("Active");
            // Defaults
            customer.setCity(request.getCity() != null && !request.getCity().isEmpty() ? request.getCity() : "Unknown");
            customer.setState(
                    request.getState() != null && !request.getState().isEmpty() ? request.getState() : "Unknown");
            customer.setPhone(
                    request.getPhone() != null && !request.getPhone().isEmpty() ? request.getPhone() : "0000000000");
            // Defaults
            customer.setCity(request.getCity() != null && !request.getCity().isEmpty() ? request.getCity() : "Unknown");
            customer.setState(
                    request.getState() != null && !request.getState().isEmpty() ? request.getState() : "Unknown");
            customer.setPhone(
                    request.getPhone() != null && !request.getPhone().isEmpty() ? request.getPhone() : "0000000000");

            customerRepository.save(customer);
            customerId = customer.getCustomerId();
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole(), customerId);
    }
}
