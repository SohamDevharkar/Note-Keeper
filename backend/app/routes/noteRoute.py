from flask import Blueprint, jsonify, request
from ..models.notes import Notes
from ..decorators import token_required
from ..extensions import db
from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError
from ..models.notes import SyncStatus
import logging
import dateutil.parser

logger = logging.getLogger(__name__)

notes_bp = Blueprint('notes', __name__, url_prefix='/api/v1/notes')

def make_aware(dt):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt    

def validate_input(input_field) :
    return input_field if input_field != None else None

@notes_bp.route('')
@token_required
def get_notes(user_id):
    notes = Notes.query.filter_by(user_id=user_id).all()
    noteList= [note.to_dict() for note in notes]
    return jsonify(noteList)

          
@notes_bp.route('/sync', methods=['POST'])
@token_required
def sync_notes(user_id):
    data = request.get_json()
    client_notes = data.get('notes', [])

    for client_note in client_notes:
        note_id = client_note.get('id')
        client_id = client_note.get('client_id')
        updated_at_str = client_note.get('updated_at')
        created_at_str = client_note.get('created_at')
        
        logger.info(f'client_id:  {client_id}')
        
        # Parse updated_at
        try:
            client_note_updated_at = dateutil.parser.isoparse(updated_at_str) if updated_at_str else datetime.now(timezone.utc)
        except (ValueError, TypeError):
            client_note_updated_at = datetime.now(timezone.utc)
            
        if client_note_updated_at.tzinfo is None:
            client_note_updated_at = client_note_updated_at.replace(tzinfo=timezone.utc)

        # Parse created_at
        try:
            created_at = dateutil.parser.isoparse(created_at_str) if created_at_str else datetime.now(timezone.utc)
        except (ValueError, TypeError):
            created_at = datetime.now(timezone.utc)
            
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        # Handle deletion case
        if client_note.get('sync_status') == "deleted":
            if note_id:
                existing_note = Notes.query.filter_by(id=note_id, user_id=user_id).first()
                if existing_note:
                    # db.session.delete(existing_note)
                    existing_note.sync_status = SyncStatus.deleted.name
                    existing_note.updated_at = datetime.now(timezone.utc)
            continue

        # Check for existing note (update)
        if note_id:
            existing_note = Notes.query.filter_by(id=note_id, user_id=user_id).first()
        else:
            existing_note = None

        if existing_note:
            if client_note_updated_at > make_aware(existing_note.updated_at):
                existing_note.title = client_note.get('title', '')
                existing_note.content = client_note.get('content', { "type": "doc", "content": [] })
                existing_note.view = client_note.get('view', 'notes')
                existing_note.prevView = client_note.get('prevView')
                existing_note.pinned = client_note.get('pinned', False)
                existing_note.bgColor = client_note.get('bgColor', 'bg-white')
                existing_note.updated_at = client_note_updated_at
                existing_note.client_id = client_note.get('client_id')
        else:
            # Create new note
            new_note = Notes(
                user_id=user_id,
                title=client_note.get('title', ''),
                content=client_note.get('content', { "type": "doc", "content": [] }),
                view=client_note.get('view', 'notes'),
                prevView=client_note.get('prevView'),
                pinned=client_note.get('pinned', False),
                bgColor=client_note.get('bgColor', 'bg-white'),
                created_at=created_at,
                updated_at=client_note_updated_at,
                sync_status = SyncStatus.synced,
                client_id = client_note.get('client_id')
            )
            db.session.add(new_note)
            db.session.flush()

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Failed to sync due to conflict or invalid data."}), 400

    notes = Notes.query.filter_by(user_id=user_id).all()
    return jsonify([note.to_dict() for note in notes]), 200

    

    

