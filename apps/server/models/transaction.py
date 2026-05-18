from uuid import UUID
from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Integer, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid
from models.enums import TransactionType

if TYPE_CHECKING:
    from models.task import Task
    from models.reward import Reward
    from models.user import User


class PointTransaction(Base, TimestampMixin):
    """Point transaction history model."""

    __tablename__ = "point_transactions"

    id: Mapped[pk_uuid]
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[TransactionType] = mapped_column(SQLEnum(TransactionType), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    
    task_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    reward_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("rewards.id", ondelete="SET NULL"), nullable=True)
    
    description: Mapped[str] = mapped_column(String(500), nullable=False)

    # Relationships
    user: Mapped["User"] = relationship()
    task: Mapped[Optional["Task"]] = relationship()
    reward: Mapped[Optional["Reward"]] = relationship()
