from jose import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "CHANGE_THIS_LATER"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=1)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)