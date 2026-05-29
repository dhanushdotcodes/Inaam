from fastapi import APIRouter
from typing import List

from core.ranks import RANKS
from schemas.progression import RankConfigResponse

router = APIRouter(prefix="/progression", tags=["Progression"])

@router.get("/ranks", response_model=List[RankConfigResponse])
async def get_all_ranks():
    """
    Get the static configuration of all ranks and their requirements.
    """
    return [
        RankConfigResponse(
            name=r.name,
            lifetime_xp=r.lifetime_xp,
            tasks_completed=r.tasks_completed,
            perfect_weeks=r.perfect_weeks
        ) for r in RANKS
    ]
