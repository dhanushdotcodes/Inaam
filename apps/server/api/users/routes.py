from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from core.database import get_db
from models.user import User
from schemas.progression import UserMeResponse
from services.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserMeResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get the current authenticated user along with their gamification progress and rank history.
    """
    # Fetch user again with loaded relationships
    query = (
        select(User)
        .where(User.id == current_user.id)
        .options(
            selectinload(User.progress),
            selectinload(User.rank_history)
        )
    )
    result = await db.execute(query)
    user = result.scalar_one()
    
    # Sort rank history by achieved_at desc
    user.rank_history.sort(key=lambda x: x.achieved_at, reverse=True)
    
    return UserMeResponse.model_validate(user)
