from typing import Sequence
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.transaction import PointTransaction
from schemas.transaction import TransactionCreate


async def get_user_points(db: AsyncSession) -> int:
    """Calculate the total points for the user (single user for now)."""
    # Total points = sum of EARNED/BONUS - sum of SPENT/PENALTY
    # But simpler: just sum all points where EARNED/BONUS are positive and SPENT/PENALTY are negative?
    # Actually, the model doesn't store negative values, it uses TransactionType.
    
    # Let's sum EARNED + BONUS
    earned_query = select(func.sum(PointTransaction.points)).where(
        PointTransaction.type.in_(["EARNED", "BONUS"])
    )
    # Let's sum SPENT + PENALTY
    spent_query = select(func.sum(PointTransaction.points)).where(
        PointTransaction.type.in_(["SPENT", "PENALTY"])
    )
    
    earned_res = await db.execute(earned_query)
    spent_res = await db.execute(spent_query)
    
    earned = earned_res.scalar() or 0
    spent = spent_res.scalar() or 0
    
    return earned - spent


async def create_transaction(
    db: AsyncSession, 
    transaction_data: TransactionCreate
) -> PointTransaction:
    """Create a new point transaction."""
    transaction = PointTransaction(**transaction_data.model_dump())
    db.add(transaction)
    await db.flush()
    await db.refresh(transaction)
    return transaction


async def get_transactions(db: AsyncSession) -> Sequence[PointTransaction]:
    """Get all point transactions."""
    query = select(PointTransaction).order_by(PointTransaction.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()
