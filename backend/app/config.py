import os
from dotenv import load_dotenv

load_dotenv()

db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_schema = os.getenv("DB_SCHEMA")
secret = os.getenv("JWT_SECRET")

class Config:
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{db_username}:{db_password}@{db_host}:{db_port}/{db_schema}'
    SQLALCHEMY_TRACK_MODIFICATIONS =False
    SECRET_KEY=f'{secret}'