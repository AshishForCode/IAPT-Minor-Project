import jwt
import sqlite3
import os
from flask import request, jsonify
from functools import wraps
from config import Config
from datetime import datetime, timedelta

def get_db_connection():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'iapt.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    return conn

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

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
