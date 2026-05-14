from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from models.enums import RewardType


class RewardBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    reward_type: RewardType = Field(default=RewardType.QUEST)
    cost_points: int = Field(default=0, ge=0)


class RewardCreate(RewardBase):
    pass


class RewardUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    reward_type: Optional[RewardType] = None
    cost_points: Optional[int] = Field(None, ge=0)
    claimed_at: Optional[datetime] = None


class RewardResponse(RewardBase):
    id: UUID
    claimed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
