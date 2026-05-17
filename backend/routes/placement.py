from flask import Blueprint, request, jsonify
from utils.helpers import token_required, get_db_connection

placement_bp = Blueprint('placement', __name__)

@placement_bp.route('/applications', methods=['GET', 'POST'])
@token_required
def handle_applications(current_user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if request.method == 'GET':
            cursor.execute("SELECT * FROM placement_applications WHERE user_id = %s", (current_user_id,))
            return jsonify(cursor.fetchall()), 200
            
        elif request.method == 'POST':
            data = request.get_json()
            company = data.get('company')
            role = data.get('role')
            status = data.get('status', 'Applied')
            
            cursor.execute("""
                INSERT INTO placement_applications (user_id, company, role, status)
                VALUES (%s, %s, %s, %s)
            """, (current_user_id, company, role, status))
            conn.commit()
            return jsonify({'message': 'Application added'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
