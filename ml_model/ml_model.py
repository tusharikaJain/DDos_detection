import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset (Replace with actual dataset path)
df = pd.read_csv("CICDDoS2019_sample.csv")

# Select features
features = ["packet_count", "byte_count", "flow_duration", "protocol"]
X = df[features]
y = df["attack_label"]  # 1 = DDoS, 0 = Normal

# Preprocess data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train model
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save model
joblib.dump(rf_model, "ddos_rf_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("✅ ML Model Saved Successfully!")
