from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()


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
    name = db.Column(db.String(120), nullable=False)
    deadline_date = db.Column(db.Date, nullable=False)
    started_work = db.Column(db.Boolean, default=False)
    image_sent = db.Column(db.Boolean, default=False)
    material_received = db.Column(db.Boolean, default=False)
    report_completed = db.Column(db.Boolean, default=False)
    review_pending = db.Column(db.Boolean, default=False)
    updated_by = db.Column(db.String(80), nullable=True)

    @property
    def days_remaining(self):
        """Calculate days remaining until deadline"""
        today = date.today()
        delta = self.deadline_date - today
        return delta.days

    @property
    def deadline_status(self):
        """Get deadline status: urgent, warning, normal, or overdue"""
        days = self.days_remaining
        if days < 0:
            return 'overdue'
        elif days <= 1:
            return 'urgent'
        elif days <= 2:
            return 'warning'
        else:
            return 'normal'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'deadline_date': self.deadline_date.isoformat(),
            'days_remaining': self.days_remaining,
            'deadline_status': self.deadline_status,
            'started_work': self.started_work,
            'image_sent': self.image_sent,
            'material_received': self.material_received,
            'report_completed': self.report_completed,
            'review_pending': self.review_pending,
            'updated_by': self.updated_by
        }
