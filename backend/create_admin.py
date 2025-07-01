from app import app, db
from models import User
from werkzeug.security import generate_password_hash

with app.app_context():
    hashed_pw = generate_password_hash("staff123")
    created_user = User(username="staff1", password_hash=hashed_pw, role="staff")
    db.session.add(created_user)
    db.session.commit()
    print("✅ Admin user created.")

