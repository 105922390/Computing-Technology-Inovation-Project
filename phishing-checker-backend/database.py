from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()


DB_URL = (
    f"mysql+pymysql://{os.getenv("DB_USER")}:"
    f"{os.getenv("DB_PASSWORD")}@"
    f"{os.getenv("DB_HOST")}/"
    f"{os.getenv("DB_NAME")}"
    )

engine = create_engine(DB_URL)