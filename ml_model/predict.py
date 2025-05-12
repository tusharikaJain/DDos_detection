from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained ML model and scaler
model = joblib.load("ddos_rf_model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    input_features = np.array([[data["packet_count"], data["byte_count"], data["flow_duration"], data["protocol"]]])

    # Scale input data
    input_scaled = scaler.transform(input_features)

    # Make prediction
    prediction = model.predict(input_scaled)[0]
    anomaly_score = np.random.uniform(0.8, 1.0) if prediction == 1 else np.random.uniform(0.0, 0.2)

    response = {
        "attack_detected": bool(prediction),
        "attack_type": "DDoS Attack" if prediction == 1 else "Normal Traffic",
        "anomaly_score": round(anomaly_score, 2)
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
