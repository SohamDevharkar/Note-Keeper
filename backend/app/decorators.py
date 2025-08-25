from flask import jsonify, request
import jwt 
from config import secret
from models import notes, users

def token_required(f):
    # This decorator manually checks JWT and sets user info for protected routes
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        try:
            data = jwt.decode(token, secret, algorithms=["HS256"])
            user_id = data["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired!"}), 401
        except Exception as e:
            return jsonify({"message": "Invalid token!", "error": str(e)}), 401
        return f(user_id, *args, **kwargs)
    decorator.__name__ = f.__name__
    return decorator