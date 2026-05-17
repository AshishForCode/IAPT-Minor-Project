import joblib
import numpy as np
import os

# Go up from backend/models/ to root, then into ml/
model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'ml', 'model.pkl')

model = None
try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
except Exception as e:
    print(f"Could not load ML model from {model_path}: {e}")

def predict_study_time(topic_completion_pct, days_until_deadline, avg_mock_score, free_time_available):
    if model is None:
        # Fallback heuristic
        return min(120, free_time_available)
        
    features = np.array([[topic_completion_pct, days_until_deadline, avg_mock_score, free_time_available]])
    prediction = model.predict(features)[0]
    
    return max(15, min(prediction, free_time_available))
