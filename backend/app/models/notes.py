import uuid
import enum
from ..extensions import db
from sqlalchemy.dialects.mysql import BINARY, JSON
from datetime import datetime, timezone
from sqlalchemy import Enum as SqlEnum

def generate_uuid_string():
    return str(uuid.uuid4())

class SyncStatus(enum.Enum):
    synced = "synced"
    pending = "pending"
    deleted = "deleted"

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
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default = lambda: datetime.now(timezone.utc), onupdate= lambda: datetime.now(timezone.utc))
    sync_status = db.Column(SqlEnum(SyncStatus), default = SyncStatus.synced, nullable=False)
    user = db.relationship('Users', back_populates='notes')
    
    def __repr__(self):
        return f'<Note {self.hex_id()}: {self.content[:20]}>'
    
    def hex_id(self):
         # Helper method to get string representation of UUID for display
        # return str(uuid.UUID(bytes=self.id)) 
        return self.id
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'view': self.view,
            'prevView': self.prevView,
            'bgColor': self.bgColor,
            'pinned': self.pinned,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'sync_status': str(self.sync_status)
        } 