import hashlib
import base64
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from core.config import settings


def verify_key(plain_key: str, hashed_key: str) -> bool:
    """
    Verify the provided plain key against the SHA-256 hash (base64 or hex).
    """
    sha256_digest = hashlib.sha256(plain_key.encode()).digest()
    
    # Check if the stored hash is hex (64 chars) or base64 (typically 44 chars)
    if len(hashed_key) == 64:
        return hashlib.sha256(plain_key.encode()).hexdigest() == hashed_key
    
    return base64.b64encode(sha256_digest).decode() == hashed_key


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt
