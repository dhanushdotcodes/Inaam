from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response structure."""

    data: Optional[T] = None
    error: Optional[str] = None
    message: str = "success"

    @classmethod
    def success(cls, data: T, message: str = "success") -> "ApiResponse[T]":
        """Helper to create a success response."""
        return cls(data=data, message=message)

    @classmethod
    def fail(cls, error: str, message: str) -> "ApiResponse[None]":
        """Helper to create an error response."""
        return ApiResponse[None](error=error, message=message)
