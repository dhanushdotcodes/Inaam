from fastapi import APIRouter, HTTPException, status
from schemas.auth import LoginRequest, LoginResponse
from services.auth import verify_key, create_access_token
from core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    """
    Login with a secret key.
    Verifies the key using SHA-256 and returns a JWT token if successful.
    """
    if not verify_key(payload.key, settings.SECRET_KEY):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid secret key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create session token
    # Since this is a simple key-based login, we don't have a user ID here yet.
    # We can include a generic subject or the hashed key if needed.
    access_token = create_access_token(data={"sub": "admin"})
    
    return LoginResponse(access_token=access_token)
