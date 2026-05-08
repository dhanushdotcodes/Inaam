from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.task import Task
from schemas.task import TaskCreate, TaskUpdate


async def get_tasks(
    db: AsyncSession, 
    reward_id: Optional[UUID] = None
) -> Sequence[Task]:
    """Get all tasks, optionally filtered by reward_id."""
    query = select(Task)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    result = await db.execute(query)
    return result.scalars().all()


async def create_task(
    db: AsyncSession, 
    reward_id: UUID, 
    task_data: TaskCreate
) -> Task:
    """Create a new task for a reward."""
    task = Task(**task_data.model_dump(), reward_id=reward_id)
    db.add(task)
    await db.flush()
    await db.refresh(task)
    return task


async def get_task(
    db: AsyncSession, 
    task_id: UUID, 
    reward_id: Optional[UUID] = None
) -> Optional[Task]:
    """Get a specific task."""
    query = select(Task).where(Task.id == task_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def update_task(
    db: AsyncSession, 
    task_id: UUID, 
    task_data: TaskUpdate,
    reward_id: Optional[UUID] = None
) -> Optional[Task]:
    """Update a specific task."""
    update_data = task_data.model_dump(exclude_unset=True)
    if not update_data:
        return await get_task(db, task_id, reward_id)
        
    query = update(Task).where(Task.id == task_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    query = query.values(**update_data).returning(Task)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def delete_task(
    db: AsyncSession, 
    task_id: UUID, 
    reward_id: Optional[UUID] = None
) -> bool:
    """Delete a specific task."""
    query = delete(Task).where(Task.id == task_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    result = await db.execute(query)
    return result.rowcount > 0


async def complete_task(
    db: AsyncSession, 
    task_id: UUID,
    reward_id: Optional[UUID] = None
) -> Optional[Task]:
    """Complete a specific task."""
    query = update(Task).where(Task.id == task_id)
    if reward_id:
        query = query.where(Task.reward_id == reward_id)
        
    query = query.values(completed=True).returning(Task)
    result = await db.execute(query)
    return result.scalar_one_or_none()
