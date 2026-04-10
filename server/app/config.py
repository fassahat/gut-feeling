from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://gutfeeling:gutfeeling@db:5432/gutfeeling"
    cors_origins: list[str] = ["*"]
    bot_typing_delay: float = 1.0

    model_config = {"env_prefix": "", "case_sensitive": False}


settings = Settings()
