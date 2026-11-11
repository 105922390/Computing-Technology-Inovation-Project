from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_url
from sqlalchemy import create_engine

app = FastAPI()

app.add_middleware(
CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

# engine = create_engine(
#     "mysql+pymysql://user:password@localhost/mydb"
# )

class UrlRequest(BaseModel):
    url: str

@app.post("/process-data")
def process_data(payload: UrlRequest):
    result = predict_url(payload.url)
    return {"result": result}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing URL Checker API!"}

# @app.get("/users/{user_id}")
# def get_user(user_id: int):

#     with engine.connect() as conn:
#         result = conn.execute(
#             text("""
#                 SELECT *
#                 FROM users
#                 WHERE id = :id
#             """),
#             {"id": user_id}
#         )

#         user = result.mappings().first()

#         return user