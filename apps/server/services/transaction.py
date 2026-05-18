from typing import Sequence
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.transaction import PointTransaction
from schemas.transaction import TransactionCreate


async def get_user_points(db: AsyncSession, user_id: UUID) -> int:
    """Calculate the total points for a specific user."""
    # Total points = sum of EARNED/BONUS - sum of SPENT/PENALTY
    
    # Let's sum EARNED + BONUS
    earned_query = select(func.sum(PointTransaction.points)).where(
        PointTransaction.user_id == user_id,
        PointTransaction.type.in_(["EARNED", "BONUS"])
    )
    # Let's sum SPENT + PENALTY
    spent_query = select(func.sum(PointTransaction.points)).where(
        PointTransaction.user_id == user_id,
        PointTransaction.type.in_(["SPENT", "PENALTY"])
    )
    
    earned_res = await db.execute(earned_query)
    spent_res = await db.execute(spent_query)
    
    earned = earned_res.scalar() or 0
    spent = spent_res.scalar() or 0
    
    return earned - spent


async def create_transaction(
    db: AsyncSession, 
    transaction_data: TransactionCreate,
    user_id: UUID
) -> PointTransaction:
    """Create a new point transaction for a specific user."""
    data = transaction_data.model_dump()
    data["user_id"] = user_id
    transaction = PointTransaction(**data)
    db.add(transaction)
    await db.flush()
    await db.refresh(transaction)
    return transaction


async def get_transactions(db: AsyncSession, user_id: UUID) -> Sequence[PointTransaction]:
    """Get all point transactions for a specific user."""
    query = (
        select(PointTransaction)
        .where(PointTransaction.user_id == user_id)
        .order_by(PointTransaction.created_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()
