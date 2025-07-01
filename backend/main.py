from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from models import db, User, Task, Patient
from utils import admin_required


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pfuser:pfpass123@localhost/patientflow'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

@app.route('/')
def index():
    return '✅ Flask backend is running'


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


#@app.route('/api/tasks')
#def get_tasks():
#    username = request.args.get('username')
#    user = User.query.filter_by(username=username).first()
#    if not user:
#        return jsonify([])

#    tasks = Task.query.filter_by(user_id=user.id).all()
#    return jsonify([{
#        'id': task.id,
#        'patient_name': task.patient_name,
#        'status': task.status,
#    } for task in tasks])



@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'deadline': p.deadline,
        'startedWork': p.started_work,
        'imageSent': p.image_sent,
        'materialReceived': p.material_received,
        'reportCompleted': p.report_completed,
        'reviewPending': p.review_pending
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
    return jsonify({'message': 'Patient added'}), 201


if __name__ == '__main__':
    app.run(debug=True)


