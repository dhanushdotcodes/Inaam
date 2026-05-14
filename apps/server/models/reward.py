from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Integer, Enum as SQLEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid
from models.enums import RewardType

if TYPE_CHECKING:
    from models.task import Task


class Reward(Base, TimestampMixin):
    """Reward model."""

    __tablename__ = "rewards"

    id: Mapped[pk_uuid]
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    reward_type: Mapped[RewardType] = mapped_column(SQLEnum(RewardType, name="reward_type_v2"), default=RewardType.QUEST)
    cost_points: Mapped[int] = mapped_column(Integer, default=0)
    claimed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    tasks: Mapped[list["Task"]] = relationship(back_populates="reward", cascade="all, delete-orphan")
