import os
from dotenv import find_dotenv, load_dotenv
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import database
from app.api.ai_routes import ai_router
from app.api.user_routes import user_router

env_path = find_dotenv()
print("Loading .env from:", env_path)
load_dotenv(dotenv_path=env_path, override=True)

DEV_ORIGIN = os.getenv("DEV_ORIGIN")
PROD_ORIGIN = os.getenv("PROD_ORIGIN")

if not DEV_ORIGIN or PROD_ORIGIN:
    raise Exception("Configuration error: could not find environment variable(s)")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await database.connect()
    yield
    # Shutdown
    await database.disconnect()

app = FastAPI(
    title="ResumAI Backend Server",
    description="Optimizes resumes based on job descriptions using AI Agents.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[DEV_ORIGIN, PROD_ORIGIN], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router, prefix="/api")
app.include_router(user_router, prefix="/api")