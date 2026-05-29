from datetime import datetime, timezone, timedelta, time
from typing import Optional, Sequence, List
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.task import Task
from models.transaction import PointTransaction
from models.enums import TransactionType
from schemas.task import TaskCreate, TaskUpdate
from schemas.transaction import TransactionCreate
from services import transaction as transaction_service


async def get_tasks(
    db: AsyncSession, 
    user_id: Optional[UUID] = None,
    tz_offset: int = 0,
    status: str = "active",
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
) -> Sequence[Task]:
    """Get tasks for a user, optionally filtered by status, search, and paginated."""
    query = select(Task)
    if user_id:
        query = query.where(Task.user_id == user_id)

        
    if search:
        query = query.where(Task.title.ilike(f"%{search}%"))

    if status == "completed":
        query = query.where(Task.completed == True)
    elif status == "active":
        query = query.where(Task.completed == False)
        
    # We order by created_at desc for consistent pagination
    query = query.order_by(Task.created_at.desc())
        
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    # Timezone-aware local day boundary logic
    now_utc = datetime.now(timezone.utc)
    local_tz = timezone(timedelta(minutes=tz_offset))
    local_now = now_utc.astimezone(local_tz)
    local_today = local_now.date()
    local_start_dt = datetime.combine(local_today, time.min, tzinfo=local_tz)
    
    # Python weekday: Mon=0, Sun=6
    today_weekday = str(local_today.weekday())
    
    final_tasks: List[Task] = []
    
    for task in tasks:
        # Check if it's a recurring task
        is_recurring_bounty = task.is_recurring and task.recurrence_days
        
        # Self-healing reset: If completed before today's local start, uncomplete it
        if is_recurring_bounty and task.completed and task.completed_at:
            if task.completed_at < local_start_dt:
                task.completed = False
                task.completed_at = None
                db.add(task)
        
        # Compute active_today
        if is_recurring_bounty:
            task.active_today = today_weekday in [d.strip() for d in task.recurrence_days.split(",")]
        else:
            task.active_today = True
            
        # Filter logic for main dashboard
        if status == "active":
            # Show only active tasks that are NOT completed
            if task.active_today and not task.completed:
                final_tasks.append(task)
        else:
            final_tasks.append(task)
            
    # Apply limit and offset in memory since python-level filtering changes the count
    return final_tasks[offset : offset + limit]


async def create_task(
    db: AsyncSession, 
    task_data: TaskCreate,
    user_id: Optional[UUID] = None
) -> Task:
    """Create a new task for a specific user."""
    data = task_data.model_dump()

    if user_id:
        data["user_id"] = user_id
        
    if data.get("pinned") is True and user_id:
        stmt = select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.pinned == True,
            Task.completed == False
        )
        res = await db.execute(stmt)
        pinned_count = res.scalar() or 0
        if pinned_count >= 3:
            raise HTTPException(status_code=400, detail="You can only pin up to 3 tasks.")
            
    task = Task(**data)
    db.add(task)
    await db.flush()
    await db.refresh(task)
    return task


async def get_task(
    db: AsyncSession, 
    task_id: UUID, 
    user_id: Optional[UUID] = None
) -> Optional[Task]:
    """Get a specific task by ID and user_id."""
    query = select(Task).where(Task.id == task_id)
    if user_id:
        query = query.where(Task.user_id == user_id)

        
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def update_task(
    db: AsyncSession, 
    task_id: UUID, 
    task_data: TaskUpdate,
    user_id: Optional[UUID] = None
) -> Optional[Task]:
    """Update a specific task."""
    # Ensure task belongs to the user
    task = await get_task(db, task_id, user_id=user_id)
    if not task:
        return None

    update_data = task_data.model_dump(exclude_unset=True)
    if not update_data:
        return task
        
    if update_data.get("pinned") is True:
        stmt = select(func.count(Task.id)).where(
            Task.user_id == task.user_id,
            Task.pinned == True,
            Task.completed == False,
            Task.id != task_id
        )
        res = await db.execute(stmt)
        pinned_count = res.scalar() or 0
        if pinned_count >= 3:
            raise HTTPException(status_code=400, detail="You can only pin up to 3 tasks.")
        
    query = update(Task).where(Task.id == task_id)
    if user_id:
        query = query.where(Task.user_id == user_id)

        
    query = query.values(**update_data).returning(Task)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def delete_task(
    db: AsyncSession, 
    task_id: UUID, 
    user_id: Optional[UUID] = None
) -> bool:
    """Delete a specific task."""
    query = delete(Task).where(Task.id == task_id)
    if user_id:
        query = query.where(Task.user_id == user_id)

        
    result = await db.execute(query)
    return result.rowcount > 0


async def complete_task(
    db: AsyncSession, 
    task_id: UUID,
    user_id: Optional[UUID] = None,
    tz_offset: int = 0
) -> Optional[Task]:
    """Complete a specific task and award points."""
    task = await get_task(db, task_id, user_id=user_id)
    if not task:
        return None
        
    if task.completed:
        return task
        
    # Create EARNED transaction
    if user_id:
        await transaction_service.create_transaction(
            db,
            TransactionCreate(
                type=TransactionType.EARNED,
                points=task.points,
                description=f"Completed task: {task.title}",
                task_id=task.id
            ),
            user_id
        )
        
        # Check and award daily threshold bonuses
        await transaction_service.check_and_award_daily_bonuses(
            db=db,
            user_id=user_id,
            tz_offset=tz_offset
        )
    
    task.completed = True
    task.completed_at = datetime.now()
    await db.flush()
    await db.refresh(task)
    return task


async def uncomplete_task(
    db: AsyncSession, 
    task_id: UUID,
    user_id: Optional[UUID] = None
) -> Optional[Task]:
    """Uncomplete/revert a completed task and deduct points by deleting the EARNED transaction."""
    task = await get_task(db, task_id, user_id=user_id)
    if not task:
        return None
        
    if not task.completed:
        return task
        
    # Delete only the most recent associated EARNED transaction
    if user_id:
        query = select(PointTransaction).where(
            PointTransaction.user_id == user_id,
            PointTransaction.task_id == task_id,
            PointTransaction.type == TransactionType.EARNED
        ).order_by(PointTransaction.created_at.desc()).limit(1)
        
        result = await db.execute(query)
        latest_tx = result.scalar_one_or_none()
        if latest_tx:
            await db.delete(latest_tx)
        
    task.completed = False
    task.completed_at = None
    await db.flush()
    await db.refresh(task)
    return task


async def get_task_analytics(
    db: AsyncSession,
    user_id: UUID,
    days: int = 7,
    tz_offset: int = 0
) -> dict:
    """
    Get task completion analytics for the specified number of days, shifted to the user's timezone.
    
    Queries point_transactions where type is EARNED to count completed tasks, ensuring that
    recurring tasks that reset daily are correctly counted.
    """
    local_tz = timezone(timedelta(minutes=tz_offset))
    now_utc = datetime.now(timezone.utc)
    local_now = now_utc.astimezone(local_tz)
    local_today = local_now.date()
    
    # Calculate start date of our analytics window (inclusive of today)
    start_date = local_today - timedelta(days=days - 1)
    local_start_dt = datetime.combine(start_date, time.min, tzinfo=local_tz)
    
    # Query EARNED transactions for the user since the start date
    query = (
        select(PointTransaction.created_at)
        .where(
            PointTransaction.user_id == user_id,
            PointTransaction.type == TransactionType.EARNED,
            PointTransaction.created_at >= local_start_dt
        )
    )
    result = await db.execute(query)
    completed_timestamps = result.scalars().all()
    
    # Pre-populate all days in the range to ensure zero-filled records for days with no activity
    completed_counts = {}
    for i in range(days):
        d = start_date + timedelta(days=i)
        date_str = d.isoformat()
        completed_counts[f"day_{i + 1}"] = {
            "completed_tasks": 0,
            "date": date_str,
            "day_label": f"Day {i + 1}"
        }
        
    # Aggregate counts by local day
    for ts in completed_timestamps:
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        
        # Convert timestamp to user's local timezone
        local_ts = ts.astimezone(local_tz)
        local_date = local_ts.date()
        
        # Find which day_index this corresponds to
        day_diff = (local_date - start_date).days
        if 0 <= day_diff < days:
            completed_counts[f"day_{day_diff + 1}"]["completed_tasks"] += 1
            
    return completed_counts

