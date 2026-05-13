from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from models.enums import TransactionType


class TransactionBase(BaseModel):
    type: TransactionType
    points: int = Field(..., ge=0)
    description: str = Field(..., max_length=500)
    task_id: Optional[UUID] = None
    reward_id: Optional[UUID] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
