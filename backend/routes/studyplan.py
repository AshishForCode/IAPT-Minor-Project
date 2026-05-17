from flask import Blueprint, jsonify, request
from utils.helpers import token_required, get_db_connection
from models.ml_model import predict_study_time

studyplan_bp = Blueprint('studyplan', __name__)

@studyplan_bp.route('/generate', methods=['GET'])
@token_required
def generate_plan(current_user_id):
    # Features required for ML prediction
    topic_completion_pct = 50.0
    days_until_deadline = 30
    avg_mock_score = 65.0
    free_time_available = 120
    
    daily_time = predict_study_time(topic_completion_pct, days_until_deadline, avg_mock_score, free_time_available)
    
    plan = {
        "daily_study_time_minutes": daily_time,
        "recommendations": [
            "Focus on high-priority topics.",
            "Take a mock test this week."
        ]
    }
    
    return jsonify(plan), 200
