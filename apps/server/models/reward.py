from typing import Optional, TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid

if TYPE_CHECKING:
    from models.task import Task


class Reward(Base, TimestampMixin):
    """Reward model."""

    __tablename__ = "rewards"

    id: Mapped[pk_uuid]
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    claimed: Mapped[bool] = mapped_column(default=False)

    # Relationships
    tasks: Mapped[list["Task"]] = relationship(back_populates="reward", cascade="all, delete-orphan")
