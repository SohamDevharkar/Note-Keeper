from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db
from .routes.auth import auth_bp
from .routes.noteRoute import notes_bp
from .routes.pingRoute import ping_bp
from .errors.errorHandlers import register_error_handlers
from .models import users
from .models import notes



def create_app() :
    app=Flask(__name__)
    app.config.from_object(Config) #Load config from config.py
    CORS(app, origins=["http://localhost:5173"])
    app.register_blueprint(auth_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(ping_bp)
    register_error_handlers(app)
    
    db.init_app(app)
        
    with app.app_context():
        # db.drop_all()
        db.create_all()
    
    return app