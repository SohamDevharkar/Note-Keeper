from flask import Flask
from .config import Config
from .extensions import db
from .routes.auth import auth_bp


def create_app() :
    app=Flask(__name__)
    app.config.from_object(Config) #Load config from config.py
    app.register_blueprint(auth_bp)
    
    db.init_app(app)
    
    from .models import users
    from .models import notes
    
    
    with app.app_context():
        #db.drop_all()
        db.create_all()
    
    return app