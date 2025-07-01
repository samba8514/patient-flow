Create new staff user:

psql -U pfuser -h localhost -d patientflow
SELECT * FROM users;
INSERT INTO users (username, password_hash, role)
VALUES ('admin', 'admin123', 'admin');


________________________________________________________________
how to delete the user database 

psql -U pfuser -h localhost -d patientflow
passwd: pfpass12

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

This will drop all tables and recreate a clean public schema.

________________________________________________________________
list users from database 

psql -U pfuser -h localhost -d patientflow

SELECT * FROM "user";

________________________________________________________________
Frontend how to start

export FLASK_APP=backend.main
flask shell

from models import db
db.create_all()

________________________________________________________________
