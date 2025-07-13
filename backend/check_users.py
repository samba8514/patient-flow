from main import app
from models import db, User

with app.app_context():
    users = User.query.all()
    print("Current users in the database:")
    for user in users:
        print(f"- Username: {user.username}, Role: {user.role}")
