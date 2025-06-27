import os
from dotenv import find_dotenv, load_dotenv
from databases import Database
from sqlalchemy import MetaData

env_path = find_dotenv()
print("Loading .env from:", env_path)
load_dotenv(dotenv_path=env_path, override=True)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL is not set in environment variables")
print(DATABASE_URL)

database = Database(DATABASE_URL)
metadata = MetaData()