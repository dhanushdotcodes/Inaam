from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from models.user import User
from schemas.base import ApiResponse
from schemas.transaction import TransactionResponse, TransactionCreate
from services import transaction as transaction_service

router = APIRouter(
    tags=["Points & Transactions"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/points", response_model=ApiResponse[int])
async def get_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current total points balance for the current user."""
    points = await transaction_service.get_user_points(db, current_user.id)
    return ApiResponse.success(data=points)


@router.get("/transactions", response_model=ApiResponse[List[TransactionResponse]])
async def list_transactions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all point transactions history for the current user."""
    transactions = await transaction_service.get_transactions(db, current_user.id)
    return ApiResponse.success(data=transactions)


@router.post("/transactions", response_model=ApiResponse[TransactionResponse], status_code=status.HTTP_201_CREATED)
async def create_transaction(
    payload: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually add a bonus or penalty transaction for the current user."""
    transaction = await transaction_service.create_transaction(db, payload, current_user.id)
    await db.commit()
    return ApiResponse.success(data=transaction)
