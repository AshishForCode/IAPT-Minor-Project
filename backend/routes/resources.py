from flask import Blueprint, jsonify
from utils.helpers import token_required, get_db_connection

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('/', methods=['GET'])
@token_required
def get_resources(current_user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM resources")
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
