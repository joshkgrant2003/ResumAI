from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str
    email: EmailStr

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: EmailStr

class UserAuth(BaseModel):
    username: str
    password: str