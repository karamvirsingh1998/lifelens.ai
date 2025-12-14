from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "LifeLens.ai"
    API_VERSION: str = "v1"
    DEBUG: bool = True
    
    # Database - Use SQLite for local development by default
    DATABASE_URL: str = "sqlite:///./lifelens.db"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    
    # CORS - comma-separated string that gets split into list
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    
    @property
    def origins_list(self) -> List[str]:
        """Convert comma-separated origins to list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

