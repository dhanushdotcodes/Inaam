from uuid import UUID
from sqlalchemy import ForeignKey, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime

from models.base import Base, pk_uuid

class UserRankHistory(Base):
    """Tracks when a user achieved a specific rank."""

    __tablename__ = "user_rank_history"

    id: Mapped[pk_uuid]
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rank: Mapped[str] = mapped_column(String(50), nullable=False)
    achieved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="rank_history")
