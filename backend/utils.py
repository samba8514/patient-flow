from functools import wraps
from flask import request, jsonify
from models import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json or {}
        username = data.get('username')

        if not username:
            return jsonify({'error': 'Username is required for admin check'}), 403

        user = User.query.filter_by(username=username).first()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin privileges required'}), 403

        return f(*args, **kwargs)
    return decorated_function
