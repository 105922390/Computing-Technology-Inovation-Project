import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_url
from rate_limit import RateLimiter, RateLimitMiddleware
from user_repositiory import login_user, create_user, get_user_by_username


app = FastAPI()

rate_limiter = RateLimiter(
    max_requests=int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "3")),
    window_seconds=float(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "5")),
)
app.add_middleware(RateLimitMiddleware, limiter=rate_limiter)

app.add_middleware(
CORSMiddleware,
    allow_origins=["http://localhost:5173",
                #    "http:/<your local ip>:5173"
                   ],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

class UrlRequest(BaseModel):
    url: str

class UserData(BaseModel):
    username: str
    password: str

@app.post("/process-data")
def process_data(payload: UrlRequest):
    result = predict_url(payload.url)
    return {"result": result}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing URL Checker API!"}

@app.post("/log-in")
def log_in(request: UserData):
    login = login_user(request.username, request.password)
    return login

@app.post("/sign-up")
def sign_up(request: UserData):
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