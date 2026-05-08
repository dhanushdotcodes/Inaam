from pydantic import BaseModel


class LoginRequest(BaseModel):
    key: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
