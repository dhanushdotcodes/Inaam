from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.reward import Reward
from schemas.reward import RewardCreate, RewardUpdate


async def get_rewards(
    db: AsyncSession, 
    status: Optional[str] = None
) -> Sequence[Reward]:
    """Get all rewards with optional status filtering."""
    query = select(Reward)
    
    if status == "claimed":
        query = query.where(Reward.claimed == True)
    elif status == "unclaimed":
        query = query.where(Reward.claimed == False)
        
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
    query = (
        update(Reward)
        .where(Reward.id == reward_id)
        .values(claimed=True)
        .returning(Reward)
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()
