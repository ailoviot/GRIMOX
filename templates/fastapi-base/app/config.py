import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self):
        self.port = int(os.getenv("PORT", "8000"))
        self.debug = os.getenv("DEBUG", "false").lower() == "true"


settings = Settings()
