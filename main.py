from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.core.db import init_db
from backend.api.v1.api import api_router
from backend.core.config import settings


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

# Configure CORS
origins = [
    settings.CLIENT_URI,  # client uri
    "http://localhost:5173",  # Vite default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {"status": "ok"}

def main():
    print("welcome to Drought prediction app")
    
if __name__ == "__main__":
    main()