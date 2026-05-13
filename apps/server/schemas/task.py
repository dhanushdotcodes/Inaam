from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from models.enums import TaskDifficulty, TaskType


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    task_type: TaskType = Field(default=TaskType.BOUNTY)
    difficulty: TaskDifficulty = Field(default=TaskDifficulty.MEDIUM)
    points: int = Field(default=0, ge=0)


class TaskCreate(TaskBase):
    reward_id: Optional[UUID] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    task_type: Optional[TaskType] = None
    difficulty: Optional[TaskDifficulty] = None
    points: Optional[int] = Field(None, ge=0)
    completed: Optional[bool] = None
    completed_at: Optional[datetime] = None
    reward_id: Optional[UUID] = None


class TaskResponse(TaskBase):
    id: UUID
    completed: bool
    completed_at: Optional[datetime]
    reward_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
