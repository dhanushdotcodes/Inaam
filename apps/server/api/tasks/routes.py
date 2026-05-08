from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from schemas.base import ApiResponse
from schemas.task import TaskResponse
from services import task as task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=ApiResponse[List[TaskResponse]])
async def list_all_tasks(db: AsyncSession = Depends(get_db)):
    """Get all tasks across all rewards."""
    tasks = await task_service.get_tasks(db)
    return ApiResponse.success(data=tasks)
