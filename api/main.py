from contextlib import asynccontextmanager
from fastapi import FastAPI
from .core.config import settings
from .core.db import init_db
from .api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup validation or DB init could go here
    # await init_db() # Enable if you want auto-create tables on startup
    yield
    # Shutdown logic


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    debug=True,
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {"status": "ok"}
