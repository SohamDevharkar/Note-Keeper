from werkzeug.exceptions import HTTPException
class DuplicateEntryException(HTTPException):
    code = 400
    description = "Duplicate entry exists."

    def __init__(self, message=None, code=None):
        if message:
            self.description = message
        if code:
            self.code = code
        super().__init__(description=self.description, response=None)