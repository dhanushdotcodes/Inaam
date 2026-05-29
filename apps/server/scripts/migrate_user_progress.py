import asyncio
from datetime import datetime, date, timedelta, timezone
import os
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Ensure we can import from apps.server
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import SessionLocal
from models.user import User
from models.transaction import PointTransaction
from models.enums import TransactionType
from models.user_progress import UserProgress
from models.user_rank_history import UserRankHistory
from core.ranks import get_highest_rank, RANKS

async def migrate_user(db: AsyncSession, user: User):
    """Calculate and backfill progression for a single user."""
    
    # 1. Fetch all point transactions in chronological order
    query = (
        select(PointTransaction)
        .where(PointTransaction.user_id == user.id)
        .order_by(PointTransaction.created_at.asc())
    )
    result = await db.execute(query)
    transactions = result.scalars().all()
    
    # State tracking
    lifetime_xp = 0
    spendable_points = 0
    total_tasks_completed = 0
    perfect_weeks = 0
    current_streak = 0
    last_active_date = None
    
    # Rank tracking
    current_rank_idx = 0
    active_rank = RANKS[0].name
    
    rank_history_entries = []
    
    for tx in transactions:
        tx_date = tx.created_at.date()  # Simplified local date handling (using UTC date for migration)
        
        # Calculate points
        if tx.type in [TransactionType.EARNED, TransactionType.BONUS]:
            spendable_points += tx.points
            lifetime_xp += tx.points
            
        elif tx.type in [TransactionType.SPENT, TransactionType.PENALTY]:
            spendable_points -= tx.points
            
        # Only EARNED implies a task was completed and streak is affected
        if tx.type == TransactionType.EARNED and tx.task_id is not None:
            total_tasks_completed += 1
            
            # Evaluate Streak and Perfect Weeks
            if last_active_date is None:
                current_streak = 1
                last_active_date = tx_date
            else:
                days_diff = (tx_date - last_active_date).days
                if days_diff == 1:
                    current_streak += 1
                elif days_diff > 1:
                    current_streak = 1
                
                # If days_diff == 0, streak does not change
                
                if current_streak == 7:
                    perfect_weeks += 1
                    current_streak = 0  # Reset for next perfect week
                    
                last_active_date = tx_date
                
        # Check if rank crossed threshold
        new_rank = get_highest_rank(lifetime_xp, total_tasks_completed, perfect_weeks)
        
        # Find index of new rank
        new_rank_idx = 0
        for i, r in enumerate(RANKS):
            if r.name == new_rank.name:
                new_rank_idx = i
                break
                
        # If we ranked up, record history
        if new_rank_idx > current_rank_idx:
            # The user might have skipped ranks, record each skipped rank exactly at this timestamp
            for i in range(current_rank_idx + 1, new_rank_idx + 1):
                skipped_rank = RANKS[i]
                rank_history_entries.append(
                    UserRankHistory(
                        user_id=user.id,
                        rank=skipped_rank.name,
                        achieved_at=tx.created_at
                    )
                )
            
            current_rank_idx = new_rank_idx
            active_rank = new_rank.name

    # Create the user progress record
    progress = UserProgress(
        user_id=user.id,
        active_rank=active_rank,
        lifetime_xp=lifetime_xp,
        spendable_points=spendable_points,
        total_tasks_completed=total_tasks_completed,
        perfect_weeks=perfect_weeks,
        current_streak=current_streak,
        last_active_date=last_active_date
    )
    
    db.add(progress)
    
    # Add rank history entries
    for history_entry in rank_history_entries:
        db.add(history_entry)
        
    # Commit changes for this user
    await db.commit()
    print(f"Migrated user {user.username}: {active_rank} ({lifetime_xp} XP, {total_tasks_completed} Tasks, {perfect_weeks} Perfect Weeks)")


async def main():
    async with SessionLocal() as db:
        # Fetch all users
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        print(f"Found {len(users)} users to migrate.")
        
        for user in users:
            await migrate_user(db, user)
            
    print("Migration complete!")


if __name__ == "__main__":
    asyncio.run(main())
