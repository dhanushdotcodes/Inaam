from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from schemas.base import ApiResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=ApiResponse[dict])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Check server and database health.
    Executes a simple query to verify database connectivity.
    """
    try:
        # Ping database
        await db.execute(text("SELECT 1"))
        return ApiResponse.success(
            data={"status": "ok", "database": "connected"},
            message="Server is healthy"
        )
    except Exception as e:
        # We don't want to return ApiResponse here because 
        # HTTPException will be caught by FastAPI's default handler 
        # or a custom one if implemented.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection failed: {str(e)}"
        )
