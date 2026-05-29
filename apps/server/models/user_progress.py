from typing import Optional
from uuid import UUID
from datetime import date

from sqlalchemy import ForeignKey, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid


class UserProgress(Base, TimestampMixin):
    """User gamification and progression data."""

    __tablename__ = "user_progress"

    id: Mapped[pk_uuid]
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # We will make these nullable initially for migration purposes
    active_rank: Mapped[str] = mapped_column(String(50), nullable=False)
    lifetime_xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    spendable_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_tasks_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    perfect_weeks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_active_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True) # Keep nullable for users who never completed a task

    # Relationships
    user: Mapped["User"] = relationship(back_populates="progress")
