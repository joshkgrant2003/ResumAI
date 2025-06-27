from fastapi import APIRouter, HTTPException
from app.schemas.users import UserCreate, UserOut, UserAuth
from app.database.database import database
from app.database.models import users
from typing import List

user_router = APIRouter()

@user_router.get("/users", response_model=List[UserOut])
async def get_users():
    query = users.select()
    all_users = await database.fetch_all(query)
    return all_users

@user_router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: int):
    query = users.select().where(users.c.id == user_id)
    user = await database.fetch_one(query)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.post("/users/create", response_model=UserOut)
async def create_user(user: UserCreate):
    query = users.insert().values(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        password=user.password,
        email=user.email,
    )
    user_id = await database.execute(query)
    return {**user.model_dump(), "id": user_id}

@user_router.post("/users/auth", response_model=UserOut)
async def auth_user(auth: UserAuth):
    query = users.select().where(
        (users.c.username == auth.username) &
        (users.c.password == auth.password)
    )
    user = await database.fetch_one(query)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return user