# AI-Powered Business Intelligence & Predictive Analytics Platform

A comprehensive mobile business intelligence application with AI-powered predictive analytics, featuring customer churn prediction and sales forecasting.

## 📂 Project Directory Structure

```
.
├── ai-bi-platform/                                 # Spring Boot Backend
│   ├── pom.xml                                     # Maven dependencies
│   ├── src/main/resources/application.properties   # App configuration (DB, Server Port)
│   ├── src/main/java/com/gpr/ai_bi/ai_bi_platform/
│   │   ├── AiBiPlatformApplication.java            # Main Entry Point
│   │   ├── config/                                 # Configuration
│   │   │   ├── DataLoader.java                     # Initial Data Seeding
│   │   │   ├── SecurityConfig.java                 # Spring Security Config
│   │   │   └── RestTemplateConfig.java
│   │   ├── controller/                             # REST API Controllers
│   │   │   ├── AuthController.java                 # Login/Register
│   │   │   ├── ChurnController.java                # Churn Prediction API
│   │   │   ├── CustomerController.java             # Customer Management
│   │   │   ├── DashboardController.java            # Dashboard Metrics
│   │   │   ├── ForecastController.java             # Sales Forecasting
│   │   │   ├── NotificationController.java
│   │   │   ├── OrderController.java                # Order Placement/Retrieval
│   │   │   ├── ProductController.java
│   │   │   ├── ReportController.java
│   │   │   ├── SalesController.java
│   │   │   ├── StockController.java
│   │   │   └── SupplierController.java
│   │   ├── service/                                # Business Logic Layer
│   │   │   ├── AuthService.java
│   │   │   ├── ChurnService.java
│   │   │   ├── CustomerService.java
│   │   │   ├── DashboardService.java
│   │   │   ├── ForecastService.java
│   │   │   ├── NotificationService.java
│   │   │   ├── OrderService.java
│   │   │   ├── ProductService.java
│   │   │   ├── ReportService.java
│   │   │   ├── SalesService.java
│   │   │   ├── StockService.java
│   │   │   └── SupplierService.java
│   │   ├── entity/                                 # Database Entities (JPA)
│   │   │   ├── AppUser.java
│   │   │   ├── ChurnPrediction.java
│   │   │   ├── Customer.java
│   │   │   ├── CustomerActivity.java
│   │   │   ├── Notification.java
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   ├── Product.java
│   │   │   ├── Report.java
│   │   │   ├── Sale.java
│   │   │   ├── SalesForecast.java
│   │   │   ├── Stock.java
│   │   │   └── Supplier.java
│   │   ├── repository/                             # Data Access Layer
│   │   │   └── [Entity]Repository.java             # (One per entity)
│   │   └── dto/                                    # Data Transfer Objects
│   │       ├── LoginRequest.java
│   │       ├── LoginResponse.java
│   │       ├── ProductRequest.java
│   │       └── RegisterRequest.java
│   └── ai_model/                                   # Python AI Microservice
│       ├── app.py                                  # FastAPI Application
│       ├── train.py                                # Model Training Script
│       ├── requirements.txt                        # Python Dependencies
│       ├── model/                                  # Trained Models
│       │   ├── churn_model.pkl
│       │   └── sales_forecast_model.pkl
│       └── data/                                   # Training Data
│           ├── churn_data.csv
│           └── monthly_sales.csv
│
└── mobile-app/                                     # React Native Mobile App (Expo)
    ├── App.js                                      # Entry Point
    ├── app.json                                    # Expo Configuration
    ├── package.json                                # NPM Dependencies
    ├── src/
    │   ├── services/
    │   │   └── api.js                              # API Configuration & Calls
    │   ├── navigation/
    │   │   ├── AppNavigator.js                     # Main Stack Navigator
    │   │   └── TabNavigator.js                     # Bottom Tab Navigator
    │   ├── screens/                                # UI Screens
    │   │   ├── LoginScreen.js
    │   │   ├── SignupScreen.js
    │   │   ├── HomeScreen.js                       # Dashboard
    │   │   ├── ChurnScreen.js
    │   │   ├── ForecastScreen.js
    │   │   ├── OrderListScreen.js
    │   │   ├── PlaceOrderScreen.js
    │   │   ├── ProductFormScreen.js
    │   │   ├── ReportScreen.js
    │   │   ├── SalesScreen.js
    │   │   ├── StockScreen.js
    │   │   ├── StockEditScreen.js
    │   │   ├── CustomerListScreen.js
    │   │   ├── ProfileScreen.js
    │   │   ├── NotificationScreen.js
    │   │   ├── WelcomeScreen.js
    │   │   └── SplashScreen.js
    │   ├── component/                              # Reusable UI Components
    │   │   └── card.js
    │   └── data/
    │       └── dummyData.js
```

## 🏗️ Architecture

The application consists of three main components:

1. **Backend (Spring Boot)** - REST API server on port 8080.
2. **AI Microservice (Python/FastAPI)** - Machine learning models on port 8000.
3. **Mobile App (React Native/Expo)** - Cross-platform mobile application.

## 📋 Prerequisites

### Backend
- Java 17 or higher
- Maven 3.6+
- (Optional) MySQL (Defaults to H2 in-memory DB)

### AI Microservice
- Python 3.8+
- pip

### Mobile App
- Node.js 18+ and npm
- Expo CLI
- Expo Go app on your physical device OR Android Emulator / iOS Simulator

## 🚀 Quick Start

### 1. Start the Backend (Spring Boot)

```bash
cd ai-bi-platform
./mvnw clean install
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 2. Start the AI Microservice (Python/FastAPI)

```bash
cd ai-bi-platform/ai_model
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
The AI service will start on `http://localhost:8000`.

### 3. Start the Mobile App (Expo)

```bash
cd mobile-app
npm install
npx expo start
```
- **Physical Device:** Scan the QR code with Expo Go.
- **Emulator:** Press `a` (Android) or `i` (iOS).

## 🐛 Troubleshooting

### "Network request timed out" or Login Error
If you see `[TypeError: Network request timed out]` when logging in:

1.  **Check IP Configuration:**
    The mobile app cannot verify `localhost` if running on a physical device. It must point to your computer's local IP address.
    
    Verified IP for this setup: **`http://172.20.10.2:8080/api`**

    Check `mobile-app/src/services/api.js`:
    ```javascript
    const BASE_URL = "http://172.20.10.2:8080/api"; 
    ```
    *Ensure your phone and computer are on the same Wi-Fi network.*

2.  **Verify Backend is Running:**
    Open `http://localhost:8080/api/dashboard/summary` in your computer's browser. You should see a JSON response.

3.  **Check Firewall:**
    Ensure your computer's firewall allows incoming connections on port 8080.

### Backend won't start
- Check Java version: `java -version` (should be 17+)
- Check port usage: `lsof -i :8080`

### Mobile App issues
- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 🔧 API & Configuration

### Backend (`application.properties`)
- Port: `8080`
- Database: H2 (default). To use MySQL, uncomment the MySQL lines in `src/main/resources/application.properties`.

### Mobile App (`api.js`)
- `BASE_URL`: API endpoint.
    - Emulator: `http://10.0.2.2:8080/api` (Android) or `http://localhost:8080/api` (iOS)
    - Physical Device: `http://<YOUR_LAN_IP>:8080/api`

## 🔐 Security Notes
- The current setup allows all CORS origins (`*`) for development ease. For production, restrict this in `SecurityConfig.java`.
- H2 Database data is lost on restart. Use MySQL for persistence.
