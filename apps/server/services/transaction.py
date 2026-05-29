from typing import Sequence, List
from uuid import UUID
from datetime import datetime, timezone, time, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.transaction import PointTransaction
from models.user_progress import UserProgress
from models.enums import TransactionType
from schemas.transaction import TransactionCreate


async def get_user_points(db: AsyncSession, user_id: UUID) -> int:
    """Get the available spendable points for a specific user."""
    query = select(UserProgress.spendable_points).where(UserProgress.user_id == user_id)
    res = await db.execute(query)
    return res.scalar() or 0


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
    
    # Update UserProgress points
    progress_query = select(UserProgress).where(UserProgress.user_id == user_id)
    res = await db.execute(progress_query)
    progress = res.scalar_one_or_none()
    
    if progress:
        if transaction.type in [TransactionType.EARNED, TransactionType.BONUS]:
            progress.spendable_points += transaction.points
            progress.lifetime_xp += transaction.points
        elif transaction.type in [TransactionType.SPENT, TransactionType.PENALTY]:
            progress.spendable_points -= transaction.points
            
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


async def check_and_award_daily_bonuses(
    db: AsyncSession, 
    user_id: UUID, 
    tz_offset: int = 0
) -> List[PointTransaction]:
    """
    Calculate daily points earned from completed tasks.
    Check if the user crossed 2K, 3K, 4K, 5K thresholds today,
    and award corresponding bonuses (+300, +500, +1000, +2000) if not already awarded.
    """
    # 1. Determine user's local day boundaries in UTC
    # tz_offset is passed in minutes (e.g. 330 for GMT+5:30)
    now_utc = datetime.now(timezone.utc)
    
    # Convert UTC now to user's local timezone
    local_tz = timezone(timedelta(minutes=tz_offset))
    local_now = now_utc.astimezone(local_tz)
    local_today = local_now.date()
    
    # Start of today in user's local timezone
    local_start_dt = datetime.combine(local_today, time.min, tzinfo=local_tz)
    
    # 2. Query sum of EARNED points since start of local day
    earned_query = select(func.sum(PointTransaction.points)).where(
        PointTransaction.user_id == user_id,
        PointTransaction.type == TransactionType.EARNED,
        PointTransaction.created_at >= local_start_dt
    )
    earned_res = await db.execute(earned_query)
    earned_today = earned_res.scalar() or 0
    
    # 3. Query already awarded BONUS milestones for today
    bonus_query = select(PointTransaction.description).where(
        PointTransaction.user_id == user_id,
        PointTransaction.type == TransactionType.BONUS,
        PointTransaction.created_at >= local_start_dt
    )
    bonus_res = await db.execute(bonus_query)
    awarded_descriptions = set(bonus_res.scalars().all())
    
    milestones = [
        {"threshold": 2000, "bonus": 300, "description": "Daily Milestone: 2,000 Points Reached! 🎉"},
        {"threshold": 3000, "bonus": 500, "description": "Daily Milestone: 3,000 Points Reached! 🚀"},
        {"threshold": 4000, "bonus": 1000, "description": "Daily Milestone: 4,000 Points Reached! 🔥"},
        {"threshold": 5000, "bonus": 2000, "description": "Daily Milestone: 5,000 Points Reached! 👑"},
    ]
    
    new_bonuses = []
    for m in milestones:
        if earned_today >= m["threshold"] and m["description"] not in awarded_descriptions:
            bonus_tx = await create_transaction(
                db=db,
                transaction_data=TransactionCreate(
                    type=TransactionType.BONUS,
                    points=m["bonus"],
                    description=m["description"]
                ),
                user_id=user_id
            )
            new_bonuses.append(bonus_tx)
            
    return new_bonuses

