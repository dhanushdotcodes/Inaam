from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserSignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


from typing import Optional, List
from schemas.progression import UserProgressResponse, UserRankHistoryResponse

class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    progress: Optional[UserProgressResponse] = None
    rank_history: List[UserRankHistoryResponse] = []

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


