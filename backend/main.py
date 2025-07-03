from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from models import db, User, Task, Patient
from utils import admin_required
from flask_socketio import SocketIO, emit


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
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'deadline': p.deadline,
        'started_work': p.started_work,
        'image_sent': p.image_sent,
        'material_received': p.material_received,
        'report_completed': p.report_completed,
        'review_pending': p.review_pending
    } for p in patients])

@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.json
    new_patient = Patient(
        name=data['name'],
        deadline=data['deadline']
    )
    db.session.add(new_patient)
    db.session.commit()

    socketio.emit('patient_added', {
        'id': new_patient.id,
        'name': new_patient.name,
        'deadline': new_patient.deadline,
        'started_work': new_patient.started_work,
        'image_sent': new_patient.image_sent,
        'material_received': new_patient.material_received,
        'report_completed': new_patient.report_completed,
        'review_pending': new_patient.review_pending
    })
    return jsonify({'status': 'ok'})

@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    data = request.json
    patient = Patient.query.get_or_404(patient_id)

    for field in ['started_work', 'image_sent', 'material_received', 'report_completed', 'review_pending']:
        if field in data:
            setattr(patient, field, data[field])

    db.session.commit()
    socketio.emit('patient_updated', patient.to_dict())  # optional real-time update
    return jsonify({'message': 'Patient updated'})


if __name__ == '__main__':
    socketio.run(app, debug=True)

