from datetime import datetime
from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.reward import Reward
from models.enums import RewardType, TransactionType
from schemas.reward import RewardCreate, RewardUpdate
from schemas.transaction import TransactionCreate
from services import transaction as transaction_service


async def get_rewards(
    db: AsyncSession, 
    status: Optional[str] = None
) -> Sequence[Reward]:
    """Get all rewards with optional status filtering."""
    query = select(Reward)
    
    if status == "claimed":
        query = query.where(Reward.claimed_at.is_not(None))
    elif status == "unclaimed":
        query = query.where(Reward.claimed_at.is_(None))
        
    result = await db.execute(query)
    return result.scalars().all()


async def create_reward(db: AsyncSession, reward_data: RewardCreate) -> Reward:
    """Create a new reward."""
    reward = Reward(**reward_data.model_dump())
    db.add(reward)
    await db.flush()
    await db.refresh(reward)
    return reward


async def get_reward(db: AsyncSession, reward_id: UUID) -> Optional[Reward]:
    """Get a specific reward by ID."""
    result = await db.execute(select(Reward).where(Reward.id == reward_id))
    return result.scalar_one_or_none()


async def update_reward(
    db: AsyncSession, 
    reward_id: UUID, 
    reward_data: RewardUpdate
) -> Optional[Reward]:
    """Update a specific reward."""
    update_data = reward_data.model_dump(exclude_unset=True)
    if not update_data:
        return await get_reward(db, reward_id)
        
    query = (
        update(Reward)
        .where(Reward.id == reward_id)
        .values(**update_data)
        .returning(Reward)
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def delete_reward(db: AsyncSession, reward_id: UUID) -> bool:
    """Delete a specific reward."""
    query = delete(Reward).where(Reward.id == reward_id)
    result = await db.execute(query)
    return result.rowcount > 0


async def claim_reward(db: AsyncSession, reward_id: UUID) -> Optional[Reward]:
    """Claim a specific reward."""
    reward = await get_reward(db, reward_id)
    if not reward:
        return None
        
    if reward.claimed_at:
        return reward
        
    # If PRIZE, check points
    if reward.reward_type == RewardType.PRIZE:
        user_points = await transaction_service.get_user_points(db)
        if user_points < reward.cost_points:
            raise ValueError(f"Insufficient points to claim reward. Need {reward.cost_points}, have {user_points}")
            
        # Create SPENT transaction
        await transaction_service.create_transaction(
            db,
            TransactionCreate(
                type=TransactionType.SPENT,
                points=reward.cost_points,
                description=f"Claimed reward: {reward.title}",
                reward_id=reward.id
            )
        )
        
    reward.claimed_at = datetime.now()
    await db.flush()
    await db.refresh(reward)
    return reward
