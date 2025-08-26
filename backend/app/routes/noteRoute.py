from flask import Blueprint, jsonify, request
from ..models import Notes
from ..decorators import token_required
from ..extensions import db

notes_bp = Blueprint('notes', __name__, url_prefix='/api/v1/notes')

def validate_input(input_field) :
    return input_field if input_field != None else None

@notes_bp.route('/newNote')
@token_required
def create_note(user_id):
    data= request.get_json()
    new_note = Notes(
        user_id=user_id,
        title = data.get('title',''),
        content = data.get('content',''),
        view = data.get('view', 'notes'),
        prevView = data.get('prevView', None),
        color = data.get('color', 'bg-white'),
        pinned = data.get('pinned', False)
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict())


@notes_bp.route('/updateNote/string: note_id', methods=['PATCH'])
@token_required
def update_note(user_id, note_id):
    data = request.get_json()
    print("current request json: " + data)
    note = Notes.query.filter_by(user_id = user_id, id=note_id).first_or_404
    for key, value in data.items():
        setattr(note, key, value) 
    db.session.commit()
    return jsonify(note.to_dict())

@notes_bp.route('/deleteNote/string: note_id', methods=['DELETE'])
@token_required
def delete_note (user_id, note_id):
    note = Notes.query.filter_by(user_id = user_id, id=note_id).first_or_404
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 204     

    

