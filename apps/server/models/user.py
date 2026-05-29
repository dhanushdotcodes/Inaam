from typing import Optional, TYPE_CHECKING, List
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin, pk_uuid

if TYPE_CHECKING:
    from models.user_progress import UserProgress
    from models.user_rank_history import UserRankHistory


class User(Base, TimestampMixin):
    """User model for authentication."""

    __tablename__ = "users"

    id: Mapped[pk_uuid]
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Gamification Progress (1-to-1)
    progress: Mapped[Optional["UserProgress"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    # Rank Timeline (1-to-Many)
    rank_history: Mapped[List["UserRankHistory"]] = relationship(back_populates="user", cascade="all, delete-orphan")
