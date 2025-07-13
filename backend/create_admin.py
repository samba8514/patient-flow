from main import app
from models import db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    # Create staff2 user
    hashed_pw2 = generate_password_hash("staff123")
    created_user2 = User(
        username="staff2",
        password_hash=hashed_pw2,
        role="staff"
    )
    db.session.add(created_user2)
    
    # Create staff3 user for testing updated_by behavior
    hashed_pw3 = generate_password_hash("staff123")
    created_user3 = User(
        username="staff3",
        password_hash=hashed_pw3,
        role="staff"
    )
    db.session.add(created_user3)
    
    db.session.commit()
    print("✅ Admin users created: staff2 and staff3")

