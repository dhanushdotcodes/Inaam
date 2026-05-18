from datetime import datetime
from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select, update, delete
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
    user_id: Optional[UUID] = None
) -> Sequence[Task]:
    """Get all tasks for a specific user, optionally filtered by reward_id."""
    query = select(Task)
    if user_id:
        query = query.where(Task.user_id == user_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    result = await db.execute(query)
    return result.scalars().all()


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
