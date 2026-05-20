from flask import Blueprint, request, jsonify
from utils.helpers import token_required, get_db_connection

timetable_bp = Blueprint('timetable', __name__)

@timetable_bp.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
@token_required
def handle_timetable(current_user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if request.method == 'GET':
            cursor.execute("SELECT * FROM timetable WHERE user_id = ?", (current_user_id,))
            return jsonify(cursor.fetchall()), 200
            
        elif request.method == 'POST':
            data = request.get_json()
            subject = data.get('subject')
            day = data.get('day')
            date = data.get('date')
            start_time = data.get('start_time')
            end_time = data.get('end_time')
            location = data.get('location')
            
            # Conflict detection logic
            cursor.execute("""
                SELECT * FROM timetable 
                WHERE user_id = ? AND date = ? 
                AND (start_time < ? AND end_time > ?)
            """, (current_user_id, date, end_time, start_time))
            
            if cursor.fetchone():
                return jsonify({'message': 'Conflict detected!'}), 409
                
            cursor.execute("""
                INSERT INTO timetable (user_id, subject, day, date, start_time, end_time, location)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (current_user_id, subject, day, date, start_time, end_time, location))
            conn.commit()
            return jsonify({'message': 'Added to timetable'}), 201
            
        elif request.method == 'PUT':
            data = request.get_json()
            timetable_id = data.get('timetable_id')
            subject = data.get('subject')
            
            cursor.execute("UPDATE timetable SET subject = ? WHERE timetable_id = ? AND user_id = ?", 
                           (subject, timetable_id, current_user_id))
            conn.commit()
            return jsonify({'message': 'Updated timetable'}), 200
            
        elif request.method == 'DELETE':
            timetable_id = request.args.get('id')
            cursor.execute("DELETE FROM timetable WHERE timetable_id = ? AND user_id = ?", (timetable_id, current_user_id))
            conn.commit()
            return jsonify({'message': 'Deleted from timetable'}), 200
            
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
