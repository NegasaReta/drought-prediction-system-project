from typing import Optional
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship
from pydantic import EmailStr


class Role(str, Enum):
    Viewer = "Viewer"
    Author = "Author"
    Admin = "Admin"


class UserBase(SQLModel):
    username: str = Field(max_length=50, index=True)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    role: Role = Field(default=Role.Viewer)
    is_active: bool = True


class User(UserBase, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

    articles: list["Article"] = Relationship(back_populates="author")


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[Role] = None
    is_active: Optional[bool] = None


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenData(SQLModel):
    username: Optional[str] = None
