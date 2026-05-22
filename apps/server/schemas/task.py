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
    is_recurring: bool = Field(default=False)
    recurrence_days: Optional[str] = Field(None, max_length=255)
    pinned: bool = Field(default=False)


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
    is_recurring: Optional[bool] = None
    recurrence_days: Optional[str] = Field(None, max_length=255)
    pinned: Optional[bool] = None


class TaskResponse(TaskBase):
    id: UUID
    completed: bool
    completed_at: Optional[datetime]
    reward_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    active_today: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


class TaskAnalyticsDay(BaseModel):
    completed_tasks: int
    date: str
    day_label: str


class TaskAnalyticsResponse(BaseModel):
    total_days: int
    completed_data: dict[str, TaskAnalyticsDay]

