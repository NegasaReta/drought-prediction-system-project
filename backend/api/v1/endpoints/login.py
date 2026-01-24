from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select

from backend.core import security
from backend.core.config import settings
from backend.api.deps import SessionDep
from backend.models.user import Token, User

router = APIRouter()


@router.post("/login/access-token", response_model=Token)
async def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    print(form_data)
    try:
        from sqlmodel import or_
        statement = select(User).where(or_(User.username == form_data.username, User.email == form_data.username))
        result = await session.exec(statement)
        user = result.first()
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=e)
    
    if not user or not security.verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.username, role=user.role, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
