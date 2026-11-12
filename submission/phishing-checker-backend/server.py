import os

from fastapi import FastAPI, Request, Query
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from typing import Annotated
from predict import predict_url
from rate_limit import RateLimiter, RateLimitMiddleware
from settings import SESSION_SECRET_KEY
from user_repositiory import verify_user, create_user, get_user_by_username, get_user
import metadata as meta


tags_metadata = [
	{
        "name": "url-checking",
        "description": "Operations relating to evaluating URLs for signs of phishing",
	},
    {
        "name": "users",
		"description": "Operations relating to user and account controls.",
	},
]


app = FastAPI(openapi_tags=tags_metadata)

rate_limiter = RateLimiter(
    max_requests=int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "5")),
    window_seconds=float(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "10")),
)

app.add_middleware(RateLimitMiddleware, limiter=rate_limiter)

app.add_middleware(
CORSMiddleware,
    allow_origins=["http://localhost:5173"
                   #    "http://<local_ip>:5173"	## For hosting
                   ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY
)

class UrlRequest(BaseModel):
    url: str = Field(
        description="The URL to check for phishing.",
        examples=["https://example.com"],
    )

class UserData(BaseModel):
    username: str = Field(
        description="The user's inputted username.",
        examples=["JohnBox"],
    )
    password: str = Field(
        description="The user's inputted password.",
        examples=["Pa$$word123"],
    )


@app.post(
	"/process-data", 
	tags=["url-checking"],
    summary="Evaluate a URL",
    description="Sends the submitted URL through the AI model and \
        returns an assesment and breakdown of how likely that link is to be phishing.",
    response_description="The prediction, confidence, and supporting evidence.",
    responses=meta.process_data_responses,
)
def process_data(payload: UrlRequest):
    result = predict_url(payload.url)
    return {"result": result}


@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing URL Checker API!"}

@app.post(
        "/log-in",
        tags=["users"],
            summary="Attempts to log the user in",
            description="Takes the given username and password, checks to see if they are valid and correct, then returns the result.",
            response_description="Whether the user should be logged in or not.",
            responses=meta.login_responses,
          )
def login(credentials: UserData, request: Request):
    login = verify_user(credentials.username, credentials.password)

    if (login and login["success"] == True):
        request.session["user_id"] = login["user_id"]
        return {"success": True}
    
    return {
        "success": False,
        "error" : login["error"]
        }

@app.post(
    "/log-out",
    tags=["users"],
    summary="Log out the current user",
    description="Clears the current browser session, ending the user's logged-in state.",
    response_description="A null response after the session is cleared.",
    responses=meta.logout_responses,
)
def logout(request: Request):
    request.session.clear()


@app.post("/sign-up", 
	tags=["users"],
    summary="Attempts to sign a new user up",
    description="Takes the given username and password, checks to see if they are valid and correct, then returns the result.",
    response_description="Whether the new user profile has been successfully created.",
    responses=meta.signup_responses,
)
def sign_up(request: UserData):
    if get_user_by_username(request.username):
        return False
    
    create_user(request.username, request.password)
    user = get_user_by_username(request.username)
    if user != None:
        return True
    else:
        return False


@app.get("/check-username-free", 
	tags=["users"],
    summary="Checks if a given username is available",
    description="Queries the user database to see if the given username is available.",
    response_description="Boolean representing if the username is available",
    responses=meta.username_available_responses,
)
def check_username_free(
    	username: Annotated[str, Query(
            description="The username to check for availability.", 
            openapi_examples={
                "sample" : { 
                    "summary": "Example username", 
                    "value": "JohnBox",
                    }
                } 
            )
		]
    ):
    existing = get_user_by_username(username)
    available = existing is None
    return available


@app.get(
    "/user-data",
    tags=["users"],
    summary="Get the current session's user",
    description="Checks the browser session to determine whether a user is logged in and, if so, returns their public profile.",
    response_description="The login state and, when logged in, the user's public ID and username.",
    responses=meta.user_data_responses,
)
def user_data(request: Request):
    user_id = request.session.get("user_id") 

    if not user_id:
        return {"logged_in": False}
    
    user = get_user(user_id)
    if user is None:
        return {"logged_in": False}

    return {
            "logged_in": True,
            "user": {
                "id": user.id,
                "username": user.username,
            }
            }