from werkzeug.exceptions import HTTPException

class InvalidInputException(HTTPException):
    code=400
    description="Invalid input or badrequest"
    
    def __init__(self, message = None, code = None):
        if message:
            self.description = message
        if code:
            self.code = code
        super().__init__(description=self.description, response=None)