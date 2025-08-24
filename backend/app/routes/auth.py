from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db
from ..models.users import Users
import uuid
import jwt
from datetime import datetime, timedelta, timezone

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    required_fields = {'firstName', 'lastName', 'userName', 'email', 'password'}
    
    if not data or not all(field in data for field in required_fields):
        return jsonify({'message' : 'Missing required fields'}),400
    
    if Users.query.filter((Users.userName == data['userName']) | (Users.email == data['email'])).first() :
        return jsonify({'message': 'Username or Email already exists'}), 400
    
    new_user = Users(
        firstName = data['firstName'],
        lastName = data['lastName'],
        userName = data['userName'],
        email = data['email']
    )
    
    new_user.password_hash = generate_password_hash(data['password'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User creadted', 'user_id': new_user.hex_id()}), 201

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    if not data or not all(k in data for k in ('userName', 'password')):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user = Users.query.filter_by(userName=data['userName']).first()
    
    if user is None or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message' : 'Invalid userName or password'}), 401
    
    # Generating token for 1 hr
    token = jwt.encode({
        'user_id': user.hex_id(),
        'expire': (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({'token': token})