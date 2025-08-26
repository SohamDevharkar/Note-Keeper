import uuid
from ..extensions import db
from sqlalchemy.dialects.mysql import BINARY, JSON

def generate_uuid_string():
    return str(uuid.uuid4())

class Notes(db.Model) :
    __tablename__ = 'notes'
    id = db.Column(db.String(36), primary_key=True, default=lambda: generate_uuid_string(), unique=True, nullable=False)
    title = db.Column(db.String(512))
    content = db.Column(JSON)
    view = db.Column(db.String(40), nullable=False)
    prevView = db.Column(db.String(40))
    bgColor = db.Column(db.String(40))
    pinned = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', back_populates='notes')
    
    def __repr__(self):
        return f'<Note {self.hex_id()}: {self.content[:20]}>'
    
    def hex_id(self):
         # Helper method to get string representation of UUID for display
        # return str(uuid.UUID(bytes=self.id)) 
        return self.id