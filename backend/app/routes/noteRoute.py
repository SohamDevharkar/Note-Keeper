from flask import Blueprint, jsonify, request
from ..models.notes import Notes
from ..decorators import token_required
from ..extensions import db
from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError
import logging
import dateutil.parser

notes_bp = Blueprint('notes', __name__, url_prefix='/api/v1/notes')

def make_aware(dt):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt    

def validate_input(input_field) :
    return input_field if input_field != None else None

@notes_bp.route('/newNote', methods=['POST'])
@token_required
def create_note(user_id):
    logging.info(f'creating new note for userid: {user_id}')
    data= request.get_json()
    logging.info(f'received user data: {data}')
    new_note = Notes(
        user_id=user_id,
        title = data.get('title',''),
        content = data.get('content',''),
        view = data.get('view', 'notes'),
        prevView = data.get('prevView', None),
        bgColor = data.get('bgColor', 'bg-white'),
        pinned = data.get('pinned', False)
    )
    db.session.add(new_note)
    db.session.commit()
    logging.info(f'new note created and saved sucessfully.')
    return jsonify(new_note.to_dict())


@notes_bp.route('/updateNote/<string:note_id>', methods=['PATCH'])
@token_required
def update_note(user_id, note_id):
    data = request.get_json()
    print(f"Payload: {data}")
    note = Notes.query.filter_by(user_id = user_id, id=note_id).first_or_404()
    for key, value in data.items():
        setattr(note, key, value) 
    db.session.commit()
    return jsonify(note.to_dict())

@notes_bp.route('/deleteNote/<string:note_id>', methods=['DELETE'])
@token_required
def delete_note (user_id, note_id):
    print(f'Deleting note id: {note_id} for user: {user_id}')
    note = Notes.query.filter_by(user_id = user_id, id=note_id).first_or_404()
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 204  

@notes_bp.route('')
@token_required
def get_notes(user_id):
    notes = Notes.query.filter_by(user_id=user_id).all()
    noteList= [note.to_dict() for note in notes]
    return jsonify(noteList)

# @notes_bp.route('/sync', methods=['POST'])
# @token_required
# def sync_notes(user_id):
#     data = request.get_json()
#     client_notes = data.get('notes', [])
#     sync_note_ids = set()
    
#     for client_note in client_notes:
#         note_id = client_note.get('id') or None
#         # client_note_updated_at = dateutil.parser.isoparse(client_note.get('updated_at'))
#         # print("Client updated_at:", client_note_updated_at, client_note_updated_at.tzinfo)
#         existing_note = Notes.query.filter_by(id=note_id, user_id=user_id).first()
#         # print("Existing updated_at:", existing_note.updated_at, existing_note.updated_at.tzinfo)    
    
#         updated_at_str = client_note.get('updated_at')
#         try:
#             client_note_updated_at =dateutil.parser.isoparse(updated_at_str) if updated_at_str else None
#         except (ValueError, TypeError):
#             client_note_updated_at = None
            
#         if client_note.get('synced_status') == "deleted":
#             if(existing_note):
#                 db.session.delete(existing_note)
#             continue
        
#         if existing_note:
#             if client_note_updated_at > make_aware(existing_note.updated_at):
#                 existing_note.title = client_note.get('title','')
#                 existing_note.content = client_note.get('content', { "type": "doc", "content": [] })
#                 existing_note.view = client_note.get('view','notes')
#                 existing_note.prevView = client_note.get('prevView', None)
#                 existing_note.pinned = client_note.get('pinned', False)
#                 existing_note.bgColor = client_note.get('bgColor', 'bg-white')
#                 existing_note.updated_at = client_note_updated_at
#         else:
#             new_note = Notes(
#                 user_id = user_id,
#                 title = client_note.get('title',''),
#                 content = client_note.get('content', { "type": "doc", "content": [] }),
#                 view = client_note.get('view', 'notes'),
#                 prevView = client_note.get('prevView', None),
#                 bgColor = client_note.get('bgColor', 'bg-white'),
#                 created_at = datetime.fromisoformat(client_note.get('created_at')) if isinstance(client_note.get('created_at'), str) else datetime.now(timezone.utc),
#                 updated_at = client_note_updated_at
#             )
#             db.session.add(new_note)
#         if note_id:   
#             sync_note_ids.add(note_id)
        
#     try:
#         db.session.commit()
#     except IntegrityError:
#         db.session.rollback()
#         return jsonify({"error": "Failed to sync due to conflict or invalid data."}), 400
        
#     notes = Notes.query.filter_by(user_id=user_id).all()
#     return jsonify([note.to_dict() for note in notes]), 200
            
@notes_bp.route('/sync', methods=['POST'])
@token_required
def sync_notes(user_id):
    data = request.get_json()
    client_notes = data.get('notes', [])
    sync_note_ids = set()

    for client_note in client_notes:
        note_id = client_note.get('id')
        updated_at_str = client_note.get('updated_at')
        created_at_str = client_note.get('created_at')

        # Parse updated_at
        try:
            client_note_updated_at = dateutil.parser.isoparse(updated_at_str) if updated_at_str else datetime.now(timezone.utc)
        except (ValueError, TypeError):
            client_note_updated_at = datetime.now(timezone.utc)

        # Parse created_at
        try:
            created_at = dateutil.parser.isoparse(created_at_str) if created_at_str else datetime.now(timezone.utc)
        except (ValueError, TypeError):
            created_at = datetime.now(timezone.utc)

        # Handle deletion case
        if client_note.get('synced_status') == "deleted":
            if note_id:
                existing_note = Notes.query.filter_by(id=note_id, user_id=user_id).first()
                if existing_note:
                    db.session.delete(existing_note)
            continue

        # Check for existing note (update)
        if note_id:
            existing_note = Notes.query.filter_by(id=note_id, user_id=user_id).first()
        else:
            existing_note = None

        if existing_note:
            # Compare timestamps
            if client_note_updated_at > make_aware(existing_note.updated_at):
                existing_note.title = client_note.get('title', '')
                existing_note.content = client_note.get('content', { "type": "doc", "content": [] })
                existing_note.view = client_note.get('view', 'notes')
                existing_note.prevView = client_note.get('prevView')
                existing_note.pinned = client_note.get('pinned', False)
                existing_note.bgColor = client_note.get('bgColor', 'bg-white')
                existing_note.updated_at = client_note_updated_at
                sync_note_ids.add(existing_note.id)
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
                updated_at=client_note_updated_at
            )
            db.session.add(new_note)
            # SQLAlchemy will auto-generate ID on commit
            db.session.flush()  # Ensure ID is generated
            sync_note_ids.add(new_note.id)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Failed to sync due to conflict or invalid data."}), 400

    notes = Notes.query.filter_by(user_id=user_id).all()
    return jsonify([note.to_dict() for note in notes]), 200

    

    

