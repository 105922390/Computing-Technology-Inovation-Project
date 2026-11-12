from dotenv import load_dotenv
import os

load_dotenv()

SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY")

if not SESSION_SECRET_KEY:
    raise RuntimeError("SESSION_SECRET_KEY has not been configured")
