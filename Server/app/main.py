from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import database
from app.api.ai_routes import ai_router
from app.api.user_routes import user_router
from app.config import DEV_ORIGIN, PROD_ORIGIN

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