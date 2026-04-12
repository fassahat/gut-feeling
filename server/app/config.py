from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    api_token: str
    cors_origins: list[str] = ["*"]
    bot_typing_delay: float = 1.0

    model_config = {"env_prefix": "", "case_sensitive": False}


settings = Settings()
