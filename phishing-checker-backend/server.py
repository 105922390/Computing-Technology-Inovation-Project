from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_url
from user_repositiory import login_user, create_user, get_user_by_username


app = FastAPI()

app.add_middleware(
CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

class UrlRequest(BaseModel):
    url: str

class SignUpRequest(BaseModel):
    username: str
    password: str

@app.post("/process-data")
def process_data(payload: UrlRequest):
    result = predict_url(payload.url)
    return {"result": result}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing URL Checker API!"}

@app.get("/log-in")
def log_in(username: str, password: str):
    login = login_user(username, password)
    return login

@app.post("/sign-up")
def sign_up(request: SignUpRequest):
    create_user(request.username, request.password)
    user = get_user_by_username(request.username)
    if user != None:
        return True
    else:
        return False

@app.get("/check-username-free")
def check_username_free(username: str):
    existing = get_user_by_username(username)
    available = existing is None
    return available