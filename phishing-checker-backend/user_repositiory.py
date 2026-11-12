from sqlalchemy import text
from database import engine
from pwdlib import PasswordHash

## Helper hashing functions
password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummy_password_for_timing_protection")

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def check_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


## --- Database actions ---

## gets user by ID
def get_user(user_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT *
                FROM user
                WHERE id = :id
            """),
            {"id": user_id}
        )
        return result.mappings().first()


# makes a new user
def create_user(username: str, password: str):
    ## Hash password
    hashed_password = hash_password(password)

    ## Submit to database
    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO user (username, password_hash)
                VALUES (
                    :username,
                    :password_hash
                ) 
            """),
            {
                "username" : username,
                "password_hash" : hashed_password
            }
        )

        conn.commit()


## Fetches user by username
def get_user_by_username(username:str):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT *
                FROM user
                WHERE username = :username
            """),
            {"username": username}
        )

        return result.mappings().first()


## Determines if a user sucessfully logged in with the provided details
def verify_user(username:str, password: str):
    user = get_user_by_username(username)

    if not user:
        # return # Uncomment for testing purposes
        password_hash.verify(password, DUMMY_HASH)
        return {"error": "Invalid username or password"}

    if not check_password(
        password,
        user.password_hash
    ):
        return {"error": "Invalid username or password"}

    return {"success": True}