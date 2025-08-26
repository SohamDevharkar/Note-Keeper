import uuid
from sqlalchemy.dialects.mysql import BINARY
from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

def generate_uuid_string():
    return str(uuid.uuid4())

class Users(db.Model):
    __tablename__ = 'users'
    
    #id = db.Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes, unique=True, nullable=False)
    id=db.Column(db.String(36), primary_key=True, default=lambda: generate_uuid_string(), unique=True, nullable=False)
    firstName = db.Column(db.String(80), unique=True, nullable=False)
    lastName = db.Column(db.String(80), unique=True, nullable=False)
    userName = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    notes = db.relationship('Notes', back_populates='user', lazy='dynamic')
    
    def __repr__(self):
        return f'<User {self.username}'
    
    def hex_id(self):
        # return str(uuid.UUID(bytes=self.id))
        return self.id
    
    def setPassword(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)