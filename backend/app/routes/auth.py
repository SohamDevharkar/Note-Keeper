from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db
from ..models.users import Users
import jwt
from datetime import datetime, timedelta, timezone
from ..errors.exceptions.UnAuthException import UnAuthException
from ..errors.exceptions.InvalidInputExcaption import InvalidInputException
from ..errors.exceptions.TokenCreationException import TokenCreationException
from ..errors.exceptions.DuplicateEntryException import DuplicateEntryException
from ..errors.exceptions.UserCreationException import UserCreationException
import logging 

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    required_fields = {'firstName', 'lastName', 'userName', 'email', 'password'}
    
    if not data or not all(field in data for field in required_fields):
        raise InvalidInputException("Missing required fields")
    
    if Users.query.filter((Users.userName == data['userName']) | (Users.email == data['email'])).first() :
        raise DuplicateEntryException('User with given Username or Email already exists')
    
    try :
        new_user = Users(
            firstName = data['firstName'],
            lastName = data['lastName'],
            userName = data['userName'],
            email = data['email']
        )

        new_user.password_hash = generate_password_hash(data['password'])
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        logger.exception(e)
        raise UserCreationException("Failed to create Usesr")
    
    return jsonify({'message': 'User creadted', 'user_id': new_user.hex_id()}), 201

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    if not data or not all(k in data for k in ('email', 'password')):
        raise InvalidInputException("Missing email or password")
    
    user = Users.query.filter_by(email=data['email']).first()

    if user is None or not check_password_hash(user.password_hash, data['password']):
        raise UnAuthException("Invalid email or password")
    
    try:
        # Generating token for 1 hr
        token = jwt.encode({
            'user_id': user.hex_id(),
            'expire': (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token': token,
                        'username': f'{user.firstName} {user.lastName}'} )
    except:
        raise TokenCreationException("Failed to create token")
    