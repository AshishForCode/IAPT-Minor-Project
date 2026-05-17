from flask import Blueprint, jsonify, request
from utils.helpers import token_required, get_db_connection

mocktests_bp = Blueprint('mocktests', __name__)

@mocktests_bp.route('/', methods=['GET'])
@token_required
def get_mock_tests(current_user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM mock_tests")
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@mocktests_bp.route('/<int:test_id>/questions', methods=['GET'])
@token_required
def get_test_questions(current_user_id, test_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT question_id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE mock_test_id = %s", (test_id,))
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@mocktests_bp.route('/<int:test_id>/submit', methods=['POST'])
@token_required
def submit_test(current_user_id, test_id):
    data = request.get_json()
    answers = data.get('answers', {}) # dict of question_id: option
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT question_id, correct_option FROM questions WHERE mock_test_id = %s", (test_id,))
        questions = cursor.fetchall()
        
        correct = 0
        total = len(questions)
        for q in questions:
            qid = str(q['question_id'])
            if qid in answers and answers[qid] == q['correct_option']:
                correct += 1
                
        score = (correct / total) * 100 if total > 0 else 0
        
        cursor.execute("""
            INSERT INTO mock_test_attempts (user_id, mock_test_id, score, percentage, time_taken)
            VALUES (%s, %s, %s, %s, %s)
        """, (current_user_id, test_id, correct, score, data.get('time_taken', 0)))
        conn.commit()
        
        return jsonify({
            'message': 'Test submitted successfully',
            'score': correct,
            'total': total,
            'percentage': score
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
