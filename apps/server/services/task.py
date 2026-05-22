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
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None,
    tz_offset: int = 0,
    filter_active_today: bool = False
) -> Sequence[Task]:
    """Get all tasks for a specific user, optionally filtered by reward_id and active_today."""
    query = select(Task)
    if user_id:
        query = query.where(Task.user_id == user_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
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
        # Check if it's a bounty (reward_id is None) and recurring
        is_recurring_bounty = task.reward_id is None and task.is_recurring and task.recurrence_days
        
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
        if filter_active_today:
            # Show if active today OR if completed today (even if not active today, just in case)
            if task.active_today or (task.completed and task.completed_at and task.completed_at >= local_start_dt):
                final_tasks.append(task)
        else:
            final_tasks.append(task)
            
    return final_tasks


async def create_task(
    db: AsyncSession, 
    task_data: TaskCreate,
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None
) -> Task:
    """Create a new task for a specific user."""
    data = task_data.model_dump()
    if reward_id:
        data["reward_id"] = reward_id
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
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None
) -> Optional[Task]:
    """Get a specific task by ID, user_id and optional reward_id."""
    query = select(Task).where(Task.id == task_id)
    if user_id:
        query = query.where(Task.user_id == user_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def update_task(
    db: AsyncSession, 
    task_id: UUID, 
    task_data: TaskUpdate,
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None
) -> Optional[Task]:
    """Update a specific task."""
    # Ensure task belongs to the user
    task = await get_task(db, task_id, reward_id, user_id)
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
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    query = query.values(**update_data).returning(Task)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def delete_task(
    db: AsyncSession, 
    task_id: UUID, 
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None
) -> bool:
    """Delete a specific task."""
    query = delete(Task).where(Task.id == task_id)
    if user_id:
        query = query.where(Task.user_id == user_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    result = await db.execute(query)
    return result.rowcount > 0


async def complete_task(
    db: AsyncSession, 
    task_id: UUID,
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None,
    tz_offset: int = 0
) -> Optional[Task]:
    """Complete a specific task and award points."""
    task = await get_task(db, task_id, reward_id, user_id)
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
    reward_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None
) -> Optional[Task]:
    """Uncomplete/revert a completed task and deduct points by deleting the EARNED transaction."""
    task = await get_task(db, task_id, reward_id, user_id)
    if not task:
        return None
        
    if not task.completed:
        return task
        
    # Delete the associated EARNED transaction
    if user_id:
        delete_query = delete(PointTransaction).where(
            PointTransaction.user_id == user_id,
            PointTransaction.task_id == task_id,
            PointTransaction.type == TransactionType.EARNED
        )
        await db.execute(delete_query)
        
    task.completed = False
    task.completed_at = None
    await db.flush()
    await db.refresh(task)
    return task
