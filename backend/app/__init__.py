from flask import Flask
from flask_cors import CORS
from .extensions import db
from .routes.auth import auth_bp
from .routes.noteRoute import notes_bp
from .routes.pingRoute import ping_bp
from .errors.errorHandlers import register_error_handlers
from .models.users import Users
from .models import notes
from werkzeug.security import generate_password_hash
import logging
from .config import env, DevelopmentConfig, ProductionConfig

logger = logging.getLogger(__name__)

def create_app() :
    app=Flask(__name__)
    
    if env == "production":
        app.config.from_object(ProductionConfig)
    else :
        app.config.from_object(DevelopmentConfig)
    
    CORS(app, origins=app.config['CORS_ORIGIN'])
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
        logger.info("Demo User added")
    else: 
        logger.info("Demo user already exist")
        
    