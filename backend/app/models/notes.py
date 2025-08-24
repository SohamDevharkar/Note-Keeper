import uuid
from ..extensions import db
from sqlalchemy.dialects.mysql import BINARY

class Notes(db.Model) :
    __tablename__ = 'notes'
    id = db.Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes, unique=True, nullable=False)
    title = db.Column(db.Text)
    content = db.Column(db.Text)
    user_id = db.Column(BINARY(16), db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', back_populates='notes')
    
    def __repr__(self):
        return f'<Note {self.hex_id()}: {self.content[:20]}>'
    
    def hex_id(self):
         # Helper method to get string representation of UUID for display
        return str(uuid.UUID(bytes=self.id)) 