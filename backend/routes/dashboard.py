from flask import Blueprint, jsonify
from utils.helpers import token_required, get_db_connection

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
@token_required
def get_summary(current_user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Dynamic summary data logic
        cursor.execute("SELECT COUNT(*) as count FROM timetable WHERE user_id = ?", (current_user_id,))
        classes_count = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM placement_applications WHERE user_id = ?", (current_user_id,))
        applications_count = cursor.fetchone()['count']
        
        # Placeholder or real counts depending on table state
        summary = {
            "classes_today": classes_count,
            "study_plan_topics": 5, # ML integration
            "tests_this_week": 1,
            "overall_progress_pct": applications_count * 10 # Example metric
        }
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
