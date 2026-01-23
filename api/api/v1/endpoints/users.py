from typing import Any
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from ....api.deps import SessionDep, CurrentUser
from ....models.user import User, UserCreate, UserRead
from ....core.security import get_password_hash

router = APIRouter()


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
