from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# User model with roles
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='staff')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    task_desc = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='pending')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('tasks', lazy=True))


class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    deadline = db.Column(db.Integer, nullable=False)
    started_work = db.Column(db.Boolean, default=False)
    image_sent = db.Column(db.Boolean, default=False)
    material_received = db.Column(db.Boolean, default=False)
    report_completed = db.Column(db.Boolean, default=False)
    review_pending = db.Column(db.Boolean, default=False)
