from flask import Blueprint, jsonify, request
from ..models.notes import Notes
from ..decorators import token_required
from ..extensions import db
import logging

notes_bp = Blueprint('notes', __name__, url_prefix='/api/v1/notes')

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
    

    

