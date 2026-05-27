from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from models.user import User
from schemas.base import ApiResponse
from schemas.task import TaskResponse, TaskCreate, TaskUpdate, TaskAnalyticsResponse
from services import task as task_service

router = APIRouter(
    prefix="/tasks", 
    tags=["Tasks"],
    dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=ApiResponse[List[TaskResponse]])
async def list_all_tasks(
    tz_offset: int = 0,
    status: str = "active",
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all tasks across all rewards for the current user."""
    tasks = await task_service.get_tasks(
        db, 
        user_id=current_user.id, 
        tz_offset=tz_offset, 
        status=status,
        search=search,
        limit=limit,
        offset=offset
    )
    await db.commit()  # Save any auto-reset changes
    return ApiResponse.success(data=tasks)


@router.post("", response_model=ApiResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
async def create_independent_task(
    payload: TaskCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new independent task for the current user."""
    task = await task_service.create_task(db, payload, user_id=current_user.id)
    await db.commit()
    return ApiResponse.success(data=task)


@router.put("/{id}", response_model=ApiResponse[TaskResponse])
async def update_independent_task(
    id: UUID, 
    payload: TaskUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific task for the current user."""
    task = await task_service.update_task(db, id, payload, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    await db.commit()
    return ApiResponse.success(data=task)


@router.patch("/{id}/complete", response_model=ApiResponse[TaskResponse])
async def complete_independent_task(
    id: UUID, 
    tz_offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Complete a specific task for the current user."""
    task = await task_service.complete_task(db, id, user_id=current_user.id, tz_offset=tz_offset)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    await db.commit()
    return ApiResponse.success(data=task)


@router.patch("/{id}/incomplete", response_model=ApiResponse[TaskResponse])
async def uncomplete_independent_task(
    id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Uncomplete/revert a specific task for the current user."""
    task = await task_service.uncomplete_task(db, id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    await db.commit()
    return ApiResponse.success(data=task)


@router.delete("/{id}", response_model=ApiResponse[bool])
async def delete_independent_task(
    id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific task for the current user."""
    success = await task_service.delete_task(db, id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    await db.commit()
    return ApiResponse.success(data=True)


@router.get("/analytics", response_model=ApiResponse[TaskAnalyticsResponse])
async def get_task_analytics_data(
    days: int = 7,
    tz_offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get task completion stats for the last N days (7, 14, 30 days)."""
    if days not in [7, 14, 30]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Days parameter must be 7, 14, or 30."
        )
    analytics_data = await task_service.get_task_analytics(
        db, user_id=current_user.id, days=days, tz_offset=tz_offset
    )
    return ApiResponse.success(data=TaskAnalyticsResponse(total_days=days, completed_data=analytics_data))

