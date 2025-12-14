from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models with error handling
try:
    if os.path.exists("model/churn_model.pkl"):
        model = joblib.load("model/churn_model.pkl")
    else:
        model = None
        print("Warning: churn_model.pkl not found")
except Exception as e:
    model = None
    print(f"Error loading churn model: {e}")

try:
    if os.path.exists("model/sales_forecast_model.pkl"):
        sales_model = joblib.load("model/sales_forecast_model.pkl")
    else:
        sales_model = None
        print("Warning: sales_forecast_model.pkl not found")
except Exception as e:
    sales_model = None
    print(f"Error loading sales forecast model: {e}")


@app.get("/")
def home():
    return {
        "message": "AI Business Intelligence Microservice is running ✅",
        "churn_model_loaded": model is not None,
        "forecast_model_loaded": sales_model is not None
    }

@app.post("/predict-churn")
def predict_churn(data: dict):
    """
    Expected Input JSON:
    {
        "last_purchase_days_ago": 30,
        "total_orders": 5,
        "total_spent": 12000,
        "complaints": 1
    }
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Churn model not available")

    try:
        features = np.array([[
            data["last_purchase_days_ago"],
            data["total_orders"],
            data["total_spent"],
            data["complaints"]
        ]])

        probability = model.predict_proba(features)[0][1]

        if probability > 0.7:
            risk = "HIGH"
        elif probability > 0.4:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        return {
            "churn_probability": round(float(probability), 2),
            "risk_level": risk
        }
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required field: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/predict-forecast")
def predict_forecast(months: int = Query(default=3, ge=1, le=12)):
    """
    Predict the sales for next N months.
    Example: /predict-forecast?months=3
    """
    if sales_model is None:
        raise HTTPException(status_code=503, detail="Forecast model not available")

    try:
        # Last known time index (t)
        last_t = 12  # because we used 12 data points

        future_predictions = []
        for i in range(1, months + 1):
            next_t = last_t + i
            predicted_sales = sales_model.predict([[next_t]])[0]
            future_predictions.append(round(float(predicted_sales), 2))

        trend = "UPWARD" if future_predictions[-1] > future_predictions[0] else "DOWNWARD"

        return {
            "months_requested": months,
            "predicted_sales": future_predictions,
            "trend": trend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast error: {str(e)}")

