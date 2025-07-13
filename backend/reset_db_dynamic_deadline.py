"""
Reset database with new deadline_date schema
This will recreate all tables with the updated Patient model
"""

from main import app
from models import db, Patient, User
from werkzeug.security import generate_password_hash
from datetime import date, timedelta


def reset_database_with_new_schema():
    with app.app_context():
        print("🔄 Dropping all tables...")
        db.drop_all()
        
        print("🏗️ Creating tables with new schema...")
        db.create_all()
        
        print("👤 Creating test users...")
        # Create test users
        users_data = [
            {"username": "staff1", "password": "staff123", "role": "staff"},
            {"username": "staff2", "password": "staff123", "role": "staff"},
            {"username": "staff3", "password": "staff123", "role": "staff"}
        ]
        
        for user_data in users_data:
            hashed_pw = generate_password_hash(user_data["password"])
            user = User(
                username=user_data["username"],
                password_hash=hashed_pw,
                role=user_data["role"]
            )
            db.session.add(user)
        
        print("🏥 Creating sample patients with dynamic deadlines...")
        # Create sample patients with different deadline dates
        sample_patients = [
            {"name": "John Doe", "days_from_now": 1},  # Due tomorrow
            {"name": "Jane Smith", "days_from_now": 3},  # Due in 3 days
            {"name": "Bob Johnson", "days_from_now": -1},  # Overdue by 1 day
            {"name": "Alice Brown", "days_from_now": 7},  # Due in a week
        ]
        
        for patient_data in sample_patients:
            deadline_date = date.today() + timedelta(
                days=patient_data["days_from_now"]
            )
            patient = Patient(
                name=patient_data["name"],
                deadline_date=deadline_date,
                updated_by="staff1"
            )
            db.session.add(patient)
        
        db.session.commit()
        print("✅ Database reset completed with dynamic deadline system!")
        print("🎯 Sample patients created with various deadline statuses")


if __name__ == '__main__':
    reset_database_with_new_schema()
