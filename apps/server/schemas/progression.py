from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID

class RankConfigResponse(BaseModel):
    name: str
    lifetime_xp: int
    tasks_completed: int
    perfect_weeks: int

class UserProgressResponse(BaseModel):
    active_rank: str
    lifetime_xp: int
    spendable_points: int
    total_tasks_completed: int
    perfect_weeks: int
    current_streak: int
    last_active_date: Optional[date]
    
    model_config = ConfigDict(from_attributes=True)

class UserRankHistoryResponse(BaseModel):
    id: UUID
    rank: str
    achieved_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserMeResponse(BaseModel):
    id: UUID
    username: str
    email: str
    progress: Optional[UserProgressResponse]
    rank_history: List[UserRankHistoryResponse]
    
    model_config = ConfigDict(from_attributes=True)
