from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_url

app = FastAPI()

app.add_middleware(
CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

class UrlRequest(BaseModel):
    url: str

@app.post("/process-data")
def process_data(payload: UrlRequest):
    result = predict_url(payload.url)
    return {"result": result}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing URL Checker API!"}
