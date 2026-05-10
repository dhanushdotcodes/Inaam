from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Inaam"
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/postgres"
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        env_nested_delimiter="__"
    )


settings = Settings()
