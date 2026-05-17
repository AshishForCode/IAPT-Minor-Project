import jwt
import mysql.connector
from flask import request, jsonify
from functools import wraps
from config import Config
from datetime import datetime, timedelta

def get_db_connection():
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB
    )

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
            else:
                token = auth_header

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
  
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user_id, *args, **kwargs)
  
    return decorated

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')
