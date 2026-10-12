from fastapi import FastAPI
from pydantic import BaseModel
from predict import predict_url

app = FastAPI()

class UrlRequest(BaseModel):
    url: str

@app.post("/process-data")
def process_data(payload: UrlRequest):
    result = predict_url(payload.url)
    return {"result": result}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing URL Checker API!"}
