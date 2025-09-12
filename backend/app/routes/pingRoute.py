from flask import Blueprint, jsonify, request
from ..decorators import token_required

ping_bp = Blueprint('ping', __name__, url_prefix='/api/v1')
@ping_bp.route('/ping', methods=['GET'])
@token_required
def ping(user_id):
    print(f'Ping request received from user: {user_id}')
    return jsonify("pong"), 200