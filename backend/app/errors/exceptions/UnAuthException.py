from werkzeug.exceptions import HTTPException

class UnAuthException(HTTPException):
    code=401
    description="Unauthorizedd access"
    
    def __init__(self, message = None, code = None):
        if message:
            self.description = message
        if code:
            self.code = code
        super().__init__(self.description)
    