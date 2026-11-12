import os

from fastapi import FastAPI, Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_url
from rate_limit import RateLimiter, RateLimitMiddleware
from settings import SESSION_SECRET_KEY
from user_repositiory import verify_user, create_user, get_user_by_username, get_user



app = FastAPI()

rate_limiter = RateLimiter(
    max_requests=int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "3")),
    window_seconds=float(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "5")),
)
app.add_middleware(RateLimitMiddleware, limiter=rate_limiter)

app.add_middleware(
CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY
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
def login(credentials: UserData, request: Request):
    login = verify_user(credentials.username, credentials.password)

    if (login and login["success"] == True):
        request.session["user_id"] = login["user_id"]
        return {"success": True}
    
    return {
        "success": False,
        "error" : login["error"]
        }

@app.post("/log-out")
def logout(request: Request):
    request.session.clear()

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

@app.get("/user-data")
def user_data(request: Request):
    user_id = request.session.get("user_id") 

    if not user_id:
        return {"logged_in": False}
    
    user = get_user(user_id)

    return {
            "logged_in": False,
            "user": user
            }