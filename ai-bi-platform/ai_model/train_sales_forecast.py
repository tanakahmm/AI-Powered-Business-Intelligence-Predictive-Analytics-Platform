import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
import joblib

# Load dataset
df = pd.read_csv("data/monthly_sales.csv")

# Create a time index (t = 1, 2, 3...)
df["t"] = np.arange(1, len(df) + 1)

# Features and target
X = df[["t"]]
y = df["revenue"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "model/sales_forecast_model.pkl")

print("✅ Sales Forecast Model trained & saved successfully!")
