from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db
from .routes.auth import auth_bp
from .routes.noteRoute import notes_bp
from .routes.pingRoute import ping_bp
from .errors.errorHandlers import register_error_handlers
from .models.users import Users
from .models import notes
from werkzeug.security import generate_password_hash



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
        
        seed_user()
    
    
    
    return app

def seed_user():
    demo_email = "demo@example.com"
    demo_password = "demo123"
    
    existingUser = Users.query.filter_by(email=demo_email).first()
    
    if not existingUser:
        demo_user = Users(
            email=demo_email,
            password_hash =generate_password_hash(demo_password),
            firstName = "demo",
            lastName = "user",
            userName = "DemoUser",
        )
        db.session.add(demo_user)
        db.session.commit()
        print("Demo User added")
    else: 
        print("Demo user already exist")
        
    