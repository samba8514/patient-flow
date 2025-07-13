from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from models import db, User, Task, Patient
from utils import admin_required
from flask_socketio import SocketIO, emit
from datetime import date, timedelta

import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return 'Flask backend is running'


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({
            'user': {
                'username': user.username,
                'role': user.role
            }
        })
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([p.to_dict() for p in patients])


@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.json
    # Convert days to actual deadline date
    days_from_now = data['deadline']
    deadline_date = date.today() + timedelta(days=days_from_now)

    new_patient = Patient(
        name=data['name'],
        deadline_date=deadline_date,
        updated_by=data.get('updated_by', 'Unknown')
    )
    db.session.add(new_patient)
    db.session.commit()

    socketio.emit('patient_added', new_patient.to_dict())
    return jsonify({'status': 'ok'})


@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    data = request.json
    patient = Patient.query.get_or_404(patient_id)

    for field in ['started_work', 'image_sent', 'material_received',
                  'report_completed', 'review_pending']:
        if field in data:
            setattr(patient, field, data[field])

    # Update the updated_by field with the current user
    if 'updated_by' in data:
        patient.updated_by = data['updated_by']

    db.session.commit()
    socketio.emit('patient_updated', patient.to_dict())
    return jsonify({'message': 'Patient updated'})


@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users in the database"""
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'role': u.role
    } for u in users])


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5002)

