from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from backend.api.deps import CurrentUser, SessionDep
from backend.models.article import Article, ArticleCreate, ArticleRead, ArticleUpdate
from backend.models.user import Role, User

router = APIRouter()


@router.post("/", response_model=ArticleRead)
async def create_article(
    *, session: SessionDep, current_user: CurrentUser, article_in: ArticleCreate
) -> Any:
    """
    Create new article.
    """
    if current_user.role not in [Role.Author, Role.Admin]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    article = Article.model_validate(article_in, update={"author_id": current_user.id})
    session.add(article)
    await session.commit()
    await session.refresh(article)
    return article


@router.get("/", response_model=list[ArticleRead])
async def read_articles(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve articles.
    """
    statement = select(Article).offset(skip).limit(limit)
    result = await session.exec(statement)
    articles = result.all()
    return articles


@router.get("/{id}", response_model=ArticleRead)
async def read_article(
    id: int,
    session: SessionDep,
) -> Any:
    """
    Get article by ID.
    """
    article = await session.get(Article, id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.put("/{id}", response_model=ArticleRead)
async def update_article(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
    article_in: ArticleUpdate,
) -> Any:
    """
    Update an article.
    """
    article = await session.get(Article, id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Check permissions: Admin or Owner
    if current_user.role != Role.Admin and current_user.id != article.author_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = article_in.model_dump(exclude_unset=True)
    article.sqlmodel_update(update_data)
    session.add(article)
    await session.commit()
    await session.refresh(article)
    return article


@router.delete("/{id}", response_model=ArticleRead)
async def delete_article(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
) -> Any:
    """
    Delete an article.
    """
    article = await session.get(Article, id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Check permissions: Admin or Owner
    if current_user.role != Role.Admin and current_user.id != article.author_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    await session.delete(article)
    await session.commit()
    return article
