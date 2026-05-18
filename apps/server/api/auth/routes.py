from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from schemas.base import ApiResponse
from schemas.auth import LoginRequest, LoginResponse, UserSignupRequest, UserResponse
from services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=ApiResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignupRequest, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with username, email, and password.
    """
    try:
        async with db.begin():
            user = await auth_service.register_user(db, payload)
        return ApiResponse.success(data=UserResponse.model_validate(user))
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Login endpoint with email and password.
    """
    user = await auth_service.authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(data={"sub": user.username})
    return LoginResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


