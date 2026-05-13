from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, String, Integer, Enum as SQLEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid
from models.enums import TaskDifficulty, TaskType

if TYPE_CHECKING:
    from models.reward import Reward


class Task(Base, TimestampMixin):
    """Task model."""

    __tablename__ = "tasks"

    id: Mapped[pk_uuid]
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    task_type: Mapped[TaskType] = mapped_column(SQLEnum(TaskType), default=TaskType.BOUNTY)
    difficulty: Mapped[TaskDifficulty] = mapped_column(SQLEnum(TaskDifficulty), default=TaskDifficulty.MEDIUM)
    points: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(default=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    reward_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("rewards.id", ondelete="CASCADE"), nullable=True)

    # Relationships
    reward: Mapped[Optional["Reward"]] = relationship(back_populates="tasks")
