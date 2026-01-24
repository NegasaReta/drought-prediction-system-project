from fastapi import APIRouter

from ..v0 import endpoint
from .endpoints import users, login, articles

api_router = APIRouter()

# Auth Route
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
# Prediction Route
api_router.include_router(endpoint.router, prefix="/predict", tags=["predict"])
# Article Feature Route
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
