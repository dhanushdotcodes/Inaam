from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from services import reward as reward_service
from services import task as task_service
from core.database import get_db
from core.security import verify_token
from schemas.base import ApiResponse
from schemas.reward import RewardCreate, RewardResponse, RewardUpdate
from schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(
    prefix="/rewards", 
    tags=["Rewards"],
    dependencies=[Depends(verify_token)]
)


@router.get("", response_model=ApiResponse[List[RewardResponse]])
async def list_rewards(
    status: Optional[str] = None, 
    db: AsyncSession = Depends(get_db)
):
    """Get all rewards with optional status filtering."""
    rewards = await reward_service.get_rewards(db, status)
    return ApiResponse.success(data=rewards)


@router.post("", response_model=ApiResponse[RewardResponse], status_code=status.HTTP_201_CREATED)
async def create_reward(
    payload: RewardCreate, 
    db: AsyncSession = Depends(get_db)
):
    """Create a new reward."""
    async with db.begin():
        reward = await reward_service.create_reward(db, payload)
    return ApiResponse.success(data=reward)


@router.get("/{id}", response_model=ApiResponse[RewardResponse])
async def get_reward(
    id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Get a specific reward."""
    reward = await reward_service.get_reward(db, id)
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    return ApiResponse.success(data=reward)


@router.put("/{id}", response_model=ApiResponse[RewardResponse])
async def update_reward(
    id: UUID, 
    payload: RewardUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """Update a specific reward."""
    async with db.begin():
        reward = await reward_service.update_reward(db, id, payload)
    
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    return ApiResponse.success(data=reward)


@router.delete("/{id}", response_model=ApiResponse[bool])
async def delete_reward(
    id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific reward."""
    async with db.begin():
        success = await reward_service.delete_reward(db, id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    return ApiResponse.success(data=True)


@router.patch("/{id}/claim", response_model=ApiResponse[RewardResponse])
async def claim_reward(
    id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Claim a specific reward."""
    try:
        async with db.begin():
            reward = await reward_service.claim_reward(db, id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    return ApiResponse.success(data=reward)


# Nested Task Routes

@router.get("/{id}/tasks", response_model=ApiResponse[List[TaskResponse]])
async def list_reward_tasks(
    id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Get all tasks for a specific reward."""
    tasks = await task_service.get_tasks(db, reward_id=id)
    return ApiResponse.success(data=tasks)


@router.post("/{id}/task", response_model=ApiResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
async def create_reward_task(
    id: UUID, 
    payload: TaskCreate, 
    db: AsyncSession = Depends(get_db)
):
    """Create a new task for a specific reward."""
    async with db.begin():
        task = await task_service.create_task(db, payload, reward_id=id)
    return ApiResponse.success(data=task)


@router.get("/{id}/task/{task_id}", response_model=ApiResponse[TaskResponse])
async def get_reward_task(
    id: UUID, 
    task_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Get a specific task for a reward."""
    task = await task_service.get_task(db, task_id, reward_id=id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    return ApiResponse.success(data=task)


@router.put("/{id}/task/{task_id}", response_model=ApiResponse[TaskResponse])
async def update_reward_task(
    id: UUID, 
    task_id: UUID, 
    payload: TaskUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """Update a specific task for a reward."""
    async with db.begin():
        task = await task_service.update_task(db, task_id, payload, reward_id=id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    return ApiResponse.success(data=task)


@router.delete("/{id}/task/{task_id}", response_model=ApiResponse[bool])
async def delete_reward_task(
    id: UUID, 
    task_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific task for a reward."""
    async with db.begin():
        success = await task_service.delete_task(db, task_id, reward_id=id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    return ApiResponse.success(data=True)


@router.patch("/{id}/task/{task_id}/complete", response_model=ApiResponse[TaskResponse])
async def complete_reward_task(
    id: UUID, 
    task_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Complete a specific task for a reward."""
    async with db.begin():
        task = await task_service.complete_task(db, task_id, reward_id=id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    return ApiResponse.success(data=task)
