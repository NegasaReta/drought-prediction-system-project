from typing import Any
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from backend.api.deps import SessionDep, CurrentUser
from backend.models.user import User, UserCreate, UserRead
from backend.core.security import get_password_hash

router = APIRouter()


from backend.models.user import User, UserCreate, UserRead, Role, UserUpdate
from backend.models.article import ArticleRead, Article

@router.get("/", response_model=list[UserRead])
async def read_users(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve users.
    """
    if current_user.role != Role.Admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    statement = select(User).offset(skip).limit(limit)
    result = await session.exec(statement)
    users = result.all()
    return users


@router.patch("/{id}/role", response_model=UserRead)
async def update_user_role(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
    role: Role,
) -> Any:
    """
    Update a user's role.
    """
    if current_user.role != Role.Admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = await session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.delete("/{id}", response_model=UserRead)
async def delete_user(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
) -> Any:
    """
    Delete a user.
    """
    if current_user.role != Role.Admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = await session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Users cannot delete themselves")
        
    await session.delete(user)
    await session.commit()
    return user


@router.get("/{id}/articles", response_model=list[ArticleRead])
async def read_user_articles(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
) -> Any:
    """
    Get all articles for a specific user.
    """
    if current_user.role != Role.Admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    statement = select(Article).where(Article.author_id == id)
    result = await session.exec(statement)
    return result.all()


@router.get("/me", response_model=UserRead)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user


@router.post("/reg", response_model=UserRead)
async def register_user(
    *,
    session: SessionDep,
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    # Check if user exists
    statement = select(User).where(User.email == user_in.email)
    result = await session.exec(statement)
    user = result.first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )

    user_obj = User.model_validate(
        user_in, update={"hashed_password": get_password_hash(user_in.password)}
    )
    session.add(user_obj)
    await session.commit()
    await session.refresh(user_obj)
    return user_obj
