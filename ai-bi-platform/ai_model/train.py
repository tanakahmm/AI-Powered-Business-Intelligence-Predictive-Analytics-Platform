import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib

# Load dataset
data = pd.read_csv("data/churn_data.csv")

X = data.drop("churn", axis=1)
y = data["churn"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "model/churn_model.pkl")

print("✅ Churn model trained and saved successfully!")
