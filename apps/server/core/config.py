from typing import Any, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Inaam"
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/postgres"
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    CORS_ORIGINS: str = "http://localhost:3000"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            if v.startswith("["):
                import json
                try:
                    v = json.loads(v)
                except json.JSONDecodeError:
                    pass
            
            if isinstance(v, str):
                return [i.strip() for i in v.split(",") if i.strip()]
        
        if isinstance(v, list):
            return [str(i).strip() for i in v if str(i).strip()]
            
        return ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()
