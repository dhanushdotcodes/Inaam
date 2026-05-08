from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid

if TYPE_CHECKING:
    from models.reward import Reward


class Task(Base, TimestampMixin):
    """Task model."""

    __tablename__ = "tasks"

    id: Mapped[pk_uuid]
    title: Mapped[str] = mapped_column(String(255))
    completed: Mapped[bool] = mapped_column(default=False)
    reward_id: Mapped[UUID] = mapped_column(ForeignKey("rewards.id", ondelete="CASCADE"))

    # Relationships
    reward: Mapped["Reward"] = relationship(back_populates="tasks")
