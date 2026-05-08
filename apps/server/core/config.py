from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Inaam"
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/postgres"
    SECRET_KEY: str
    JWT_SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()
