from app import app, db
from models import Task, User

with app.app_context():
    user = User.query.filter_by(username='staff1').first()
    if user:
        task = Task(
            patient_name="John Doe",
            task_desc="Call patient X to follow up",
            user_id=user.id
        )

        db.session.add(task)
        db.session.commit()
        print("Task added.")
    else:
        print("User not found.")
