from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from services import reward as reward_service
from services import task as task_service
from core.database import get_db
from core.security import get_current_user
from models.user import User
from schemas.base import ApiResponse
from schemas.reward import RewardCreate, RewardResponse, RewardUpdate
from schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(
    prefix="/rewards", 
    tags=["Rewards"],
    dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=ApiResponse[List[RewardResponse]])
async def list_rewards(
    status: Optional[str] = None, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all rewards with optional status filtering."""
    rewards = await reward_service.get_rewards(db, status, current_user.id)
    return ApiResponse.success(data=rewards)


@router.post("", response_model=ApiResponse[RewardResponse], status_code=status.HTTP_201_CREATED)
async def create_reward(
    payload: RewardCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new reward."""
    reward = await reward_service.create_reward(db, payload, current_user.id)
    await db.commit()
    return ApiResponse.success(data=reward)


@router.get("/{id}", response_model=ApiResponse[RewardResponse])
async def get_reward(
    id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific reward."""
    reward = await reward_service.get_reward(db, id, current_user.id)
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific reward."""
    reward = await reward_service.update_reward(db, id, payload, current_user.id)
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    await db.commit()
    return ApiResponse.success(data=reward)


@router.delete("/{id}", response_model=ApiResponse[bool])
async def delete_reward(
    id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific reward."""
    success = await reward_service.delete_reward(db, id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    await db.commit()
    return ApiResponse.success(data=True)


@router.patch("/{id}/claim", response_model=ApiResponse[RewardResponse])
async def claim_reward(
    id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Claim a specific reward."""
    try:
        reward = await reward_service.claim_reward(db, id, current_user.id)
        if not reward:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Reward with id {id} not found"
            )
        await db.commit()
    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    return ApiResponse.success(data=reward)


# Nested Task Routes

@router.get("/{id}/tasks", response_model=ApiResponse[List[TaskResponse]])
async def list_reward_tasks(
    id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all tasks for a specific reward."""
    # Ensure reward exists and belongs to user
    reward = await reward_service.get_reward(db, id, current_user.id)
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    tasks = await task_service.get_tasks(db, reward_id=id, user_id=current_user.id)
    return ApiResponse.success(data=tasks)


@router.post("/{id}/task", response_model=ApiResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
async def create_reward_task(
    id: UUID, 
    payload: TaskCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task for a specific reward."""
    # Ensure reward exists and belongs to user
    reward = await reward_service.get_reward(db, id, current_user.id)
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Reward with id {id} not found"
        )
    task = await task_service.create_task(db, payload, reward_id=id, user_id=current_user.id)
    await db.commit()
    return ApiResponse.success(data=task)


@router.get("/{id}/task/{task_id}", response_model=ApiResponse[TaskResponse])
async def get_reward_task(
    id: UUID, 
    task_id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific task for a reward."""
    task = await task_service.get_task(db, task_id, reward_id=id, user_id=current_user.id)
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific task for a reward."""
    task = await task_service.update_task(db, task_id, payload, reward_id=id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    await db.commit()
    return ApiResponse.success(data=task)


@router.delete("/{id}/task/{task_id}", response_model=ApiResponse[bool])
async def delete_reward_task(
    id: UUID, 
    task_id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific task for a reward."""
    success = await task_service.delete_task(db, task_id, reward_id=id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    await db.commit()
    return ApiResponse.success(data=True)


@router.patch("/{id}/task/{task_id}/complete", response_model=ApiResponse[TaskResponse])
async def complete_reward_task(
    id: UUID, 
    task_id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Complete a specific task for a reward."""
    task = await task_service.complete_task(db, task_id, reward_id=id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with id {task_id} not found for reward {id}"
        )
    await db.commit()
    return ApiResponse.success(data=task)
