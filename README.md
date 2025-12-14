# AI-Powered Business Intelligence & Predictive Analytics Platform

A comprehensive mobile business intelligence application with AI-powered predictive analytics, featuring customer churn prediction and sales forecasting.

## 🏗️ Architecture

The application consists of three main components:

1. **Backend (Spring Boot)** - REST API server on port 8080
2. **AI Microservice (Python/FastAPI)** - Machine learning models on port 8000
3. **Mobile App (React Native/Expo)** - Cross-platform mobile application

## 📋 Prerequisites

### Backend
- Java 17 or higher
- Maven 3.6+

### AI Microservice
- Python 3.8+
- pip

### Mobile App
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## 🚀 Quick Start

### 1. Start the Backend (Spring Boot)

```bash
cd ai-bi-platform
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

**Verify it's running:**
```bash
curl http://localhost:8080/api/dashboard/summary
```

### 2. Start the AI Microservice (Python/FastAPI)

```bash
cd ai-bi-platform/ai_model

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app:app --reload --port 8000
```

The AI service will start on `http://localhost:8000`

**Verify it's running:**
```bash
curl http://localhost:8000/
```

### 3. Start the Mobile App (Expo)

```bash
cd mobile-app

# Install dependencies (first time only)
npm install

# Start Expo dev server
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📱 Using the Application

1. **Splash Screen** - Auto-navigates to login after 2 seconds
2. **Login Screen** - Demo login (no authentication required)
3. **Dashboard** - View business metrics (revenue, profit, customers, growth)
4. **Churn Prediction** - Predict customer churn risk
5. **Sales Forecast** - View 3-month sales forecast

## 🧪 Testing the APIs

### Dashboard API
```bash
curl http://localhost:8080/api/dashboard/summary
```

Expected response:
```json
{
  "revenue": "₹48,20,000",
  "profit": "₹12,45,000",
  "customers": 1920,
  "growth": "21.4%"
}
```

### Churn Prediction API
```bash
curl -X POST http://localhost:8080/api/churn/predict \
  -H "Content-Type: application/json" \
  -d '{
    "last_purchase_days_ago": 30,
    "total_orders": 5,
    "total_spent": 12000,
    "complaints": 1
  }'
```

### Sales Forecast API
```bash
curl "http://localhost:8080/api/forecast/predict?months=3"
```

## 🔧 Configuration

### Backend Configuration

Edit `ai-bi-platform/src/main/resources/application.properties`:

- **Database**: Currently using H2 in-memory database. To use MySQL, uncomment the MySQL configuration and comment out H2 settings.
- **Server Port**: Default is 8080
- **CORS**: Enabled for all origins (configure for production)

### Mobile App Configuration

Edit `mobile-app/src/services/api.js`:

- **BASE_URL**: Update if backend is not on localhost:8080
- **TIMEOUT**: Request timeout in milliseconds (default: 10000)

## 📁 Project Structure

```
.
├── ai-bi-platform/              # Spring Boot backend
│   ├── src/main/java/           # Java source code
│   │   └── com/gpr/ai_bi/
│   │       ├── controller/      # REST controllers
│   │       ├── service/         # Business logic
│   │       └── model/           # Data models
│   ├── src/main/resources/      # Configuration files
│   ├── ai_model/                # Python AI microservice
│   │   ├── app.py              # FastAPI application
│   │   ├── model/              # ML model files
│   │   └── requirements.txt    # Python dependencies
│   └── pom.xml                 # Maven configuration
│
└── mobile-app/                  # React Native mobile app
    ├── src/
    │   ├── screens/            # App screens
    │   ├── component/          # Reusable components
    │   ├── services/           # API services
    │   └── navigation/         # Navigation config
    ├── app.js                  # App entry point
    └── package.json            # npm dependencies
```

## 🐛 Troubleshooting

### Backend won't start
- Check Java version: `java -version` (should be 17+)
- Clean and rebuild: `./mvnw clean install`
- Check port 8080 is not in use: `lsof -i :8080`

### AI Microservice errors
- Ensure Python 3.8+: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`
- Check port 8000 is available: `lsof -i :8000`
- If models are missing, the service will still run but predictions will return 503 errors

### Mobile App issues
- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check that backend and AI service are running
- Verify API URLs in `src/services/api.js`

### Network errors in mobile app
- If using iOS simulator/Android emulator, use `http://localhost:8080`
- If using physical device, replace `localhost` with your computer's IP address
- Ensure all services are running and accessible

## 🔐 Security Notes

**For Production:**
- Configure specific CORS origins instead of `*`
- Add authentication and authorization
- Use environment variables for sensitive configuration
- Enable HTTPS
- Secure database credentials
- Implement rate limiting

## 📝 Development Notes

- The backend uses H2 in-memory database by default (data is lost on restart)
- Dashboard data is currently mocked - replace with actual database queries
- AI models need to be trained before predictions work (model files not included)
- Mobile app uses demo authentication (no real login required)

## 🎯 Next Steps

1. Train and add ML model files to `ai-bi-platform/ai_model/model/`
2. Set up MySQL database and populate with real data
3. Implement proper authentication
4. Add more analytics features
5. Deploy to production environment

## 📄 License

This project is for educational and demonstration purposes.
