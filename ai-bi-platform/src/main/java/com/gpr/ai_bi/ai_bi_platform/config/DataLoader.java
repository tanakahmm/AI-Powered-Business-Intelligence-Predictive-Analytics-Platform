package com.gpr.ai_bi.ai_bi_platform.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gpr.ai_bi.ai_bi_platform.entity.AppUser;
import com.gpr.ai_bi.ai_bi_platform.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only initialize users if the database is empty or specific users don't exist.
        // We do NOT want to wipe data on every restart anymore.

        createIfNotFound("admin@aibi.com", "Admin User", "admin123", "ADMIN");
        createIfNotFound("manager@aibi.com", "Manager User", "manager123", "MANAGER");
        createIfNotFound("prajith@gmail.com", "Prajith", "prajith", "CUSTOMER");

        System.out.println("✅ Default users verification finished.");
    }

    private void createIfNotFound(String email, String name, String rawPassword, String role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            AppUser user = new AppUser();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            userRepository.save(user);
            System.out.println("Created user: " + email);
        } else {
            System.out.println("User already exists: " + email);
        }

        // We have removed all hardcoded Customers, Products, Orders, Sales, etc.
        // The application will now rely on data created via the App or API.
        System.out.println("🚀 DataLoader finished. System ready with persistent data.");
    }
}
