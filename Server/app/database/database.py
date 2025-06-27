from app.config import DATABASE_URL
from databases import Database
from sqlalchemy import MetaData

print(DATABASE_URL)

database = Database(DATABASE_URL)
metadata = MetaData()