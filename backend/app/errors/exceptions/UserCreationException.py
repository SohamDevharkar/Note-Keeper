from werkzeug.exceptions import HTTPException

class UserCreationException(HTTPException):
    code = 500
    description = "Failed to create user."

    def __init__(self, message=None):
        if message:
            self.description = message
        super().__init__(description=self.description)
