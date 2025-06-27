import os
from dotenv import load_dotenv, find_dotenv

# init log directory variable used for logging
LOG_DIR = "app/logs"

# load .env only if running locally
if os.getenv("RENDER") != "true":
    env_path = find_dotenv()
    if env_path:
        print("Loading local .env file:", env_path)
        load_dotenv(dotenv_path=env_path, override=True)
    else:
        print(".env file not found locally")

# now read variables normally
DATABASE_URL = os.getenv("DATABASE_URL")
DEV_ORIGIN = os.getenv("DEV_ORIGIN")
PROD_ORIGIN = os.getenv("PROD_ORIGIN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# validate required variables
missing = []
if not DATABASE_URL: missing.append("DATABASE_URL")
if not DEV_ORIGIN: missing.append("DEV_ORIGIN")
if not PROD_ORIGIN: missing.append("PROD_ORIGIN")
if not OPENAI_API_KEY: missing.append("OPENAI_API_KEY")

if missing:
    raise Exception(f"Missing required environment variable(s): {', '.join(missing)}")
