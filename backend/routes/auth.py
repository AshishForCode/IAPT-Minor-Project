from flask import Blueprint, request, jsonify
import bcrypt
from utils.helpers import get_db_connection, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone = data.get('phone', '')
    college = data.get('college', '')
    branch = data.get('branch', '')
    year = data.get('year')
    year = int(year) if year else None
    reg_no = data.get('reg_no', '')

    if not name or not email or not password:
        return jsonify({'message': 'Name, email and password are required'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT user_id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Email already exists'}), 400

        query = """
            INSERT INTO users (name, email, password_hash, phone, college, branch, year, reg_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        cursor.execute(query, (name, email, hashed_password, phone, college, branch, year, reg_no))
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT user_id, password_hash, name, role FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401

        token = generate_token(user['user_id'])
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['user_id'],
                'name': user['name'],
                'email': email,
                'role': user['role']
            }
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
