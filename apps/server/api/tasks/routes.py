from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import verify_token
from schemas.base import ApiResponse
from schemas.task import TaskResponse, TaskCreate, TaskUpdate
from services import task as task_service

router = APIRouter(
    prefix="/tasks", 
    tags=["Tasks"],
    dependencies=[Depends(verify_token)]
)


@router.get("", response_model=ApiResponse[List[TaskResponse]])
async def list_all_tasks(db: AsyncSession = Depends(get_db)):
    """Get all tasks across all rewards."""
    tasks = await task_service.get_tasks(db)
    return ApiResponse.success(data=tasks)


@router.post("", response_model=ApiResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
async def create_independent_task(
    payload: TaskCreate, 
    db: AsyncSession = Depends(get_db)
):
    """Create a new independent task."""
    async with db.begin():
        task = await task_service.create_task(db, payload)
    return ApiResponse.success(data=task)


@router.put("/{id}", response_model=ApiResponse[TaskResponse])
async def update_independent_task(
    id: UUID, 
    payload: TaskUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """Update a specific task."""
    async with db.begin():
        task = await task_service.update_task(db, id, payload)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    return ApiResponse.success(data=task)


@router.patch("/{id}/complete", response_model=ApiResponse[TaskResponse])
async def complete_independent_task(
    id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Complete a specific task."""
    async with db.begin():
        task = await task_service.complete_task(db, id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    return ApiResponse.success(data=task)


@router.delete("/{id}", response_model=ApiResponse[bool])
async def delete_independent_task(
    id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific task."""
    async with db.begin():
        success = await task_service.delete_task(db, id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {id} not found"
        )
    return ApiResponse.success(data=True)
