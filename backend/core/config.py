from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Drought Prediction System API"

    # SECURITY
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # DATABASE
    POSTGRES_URL: str = os.getenv("POSTGRES_URL")

    # CLIENT URI
    CLIENT_URI: str = os.getenv("CLIENT_URI")
    
    @field_validator("POSTGRES_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str):
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://")
        if (
            v
            and v.startswith("postgresql://")
            and not v.startswith("postgresql+asyncpg://")
        ):
            return v.replace("postgresql://", "postgresql+asyncpg://")
        return v

    class ConfigDict:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
