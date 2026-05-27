from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from services import reward as reward_service
from core.database import get_db
from core.security import get_current_user
from models.user import User
from schemas.base import ApiResponse
from schemas.reward import RewardCreate, RewardResponse, RewardUpdate

router = APIRouter(
    prefix="/rewards", 
    tags=["Rewards"],
    dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=ApiResponse[List[RewardResponse]])
async def list_rewards(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all rewards with optional status filtering."""
    rewards = await reward_service.get_rewards(
        db, status=status, user_id=current_user.id, search=search, limit=limit, offset=offset
    )
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



