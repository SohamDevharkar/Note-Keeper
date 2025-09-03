from flask import jsonify
from .exceptions.UnAuthException import UnAuthException
from .exceptions.InvalidInputExcaption import InvalidInputException
from .exceptions.TokenCreationException import TokenCreationException
from .exceptions.DuplicateEntryException import DuplicateEntryException
from .exceptions.UserCreationException import UserCreationException
def register_error_handlers(app):
    
    @app.errorhandler(UnAuthException)
    def handle_Unauth_exception(e):
        response={
            "error":"Unauthorized access",
            "message": e.description,
            "code": e.code
        }
        return jsonify(response), e.code
    
    @app.errorhandler(InvalidInputException)
    def handle_invalid_input_exception(e):
        response={
            "error":"Invalid Input",
            "message": e.description,
            "code": e.code
        }
        return jsonify(response)
    
    @app.errorhandler(TokenCreationException)
    def handle_tokengen_exception(e):
        response={
            "error":"Token generation exception",
            "message": e.description,
            "code": e.code
        }
        return jsonify(response)
    
    @app.errorhandler(DuplicateEntryException)
    def handle_duplicate_entry(e):
        response = {
            "error": "DuplicateEntry",
            "message": e.description,
            "status": e.code,
        }
        return jsonify(response), e.code
    
    @app.errorhandler(UserCreationException)
    def handle_user_creation_error(e):
        return jsonify({
            'error': 'UserCreationFailed',
            'message': e.description,
            'status': e.code
        }), e.code
