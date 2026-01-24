from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel, Relationship

# We need to import User to make the relationship work, but to avoid circular imports we might need to be careful.
# However, usually in SQLModel passing the string "User" works for forward references if configured correctly,
# but importing the class is safer if strictly typed.
# Let's use TYPE_CHECKING pattern if needed, but for now simple import might work if User doesn't import Article.
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User


class ArticleBase(SQLModel):
    title: str = Field(index=True)
    content: str


class Article(ArticleBase, table=True):
    __tablename__ = "articles"

    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    author: Optional["User"] = Relationship(back_populates="articles")


class ArticleCreate(ArticleBase):
    pass


class ArticleRead(ArticleBase):
    id: int
    author_id: int
    created_at: datetime


class ArticleUpdate(SQLModel):
    title: Optional[str] = None
    content: Optional[str] = None
