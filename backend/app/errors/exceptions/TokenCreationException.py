from werkzeug.exceptions import HTTPException

class TokenCreationException(HTTPException):
    code=500
    description="Token creation failed"
    
    def __init__(self, message=None, code=None):
        if message:
            self.description = message
        if code:
            self.code = code
        super.__init__(description=self.description, response=None)