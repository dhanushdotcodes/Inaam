from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import verify_token
from schemas.base import ApiResponse
from schemas.transaction import TransactionResponse, TransactionCreate
from services import transaction as transaction_service

router = APIRouter(
    tags=["Points & Transactions"],
    dependencies=[Depends(verify_token)]
)


@router.get("/points", response_model=ApiResponse[int])
async def get_points(db: AsyncSession = Depends(get_db)):
    """Get the current total points balance."""
    points = await transaction_service.get_user_points(db)
    return ApiResponse.success(data=points)


@router.get("/transactions", response_model=ApiResponse[List[TransactionResponse]])
async def list_transactions(db: AsyncSession = Depends(get_db)):
    """Get all point transactions history."""
    transactions = await transaction_service.get_transactions(db)
    return ApiResponse.success(data=transactions)


@router.post("/transactions", response_model=ApiResponse[TransactionResponse], status_code=status.HTTP_201_CREATED)
async def create_transaction(
    payload: TransactionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Manually add a bonus or penalty transaction."""
    async with db.begin():
        transaction = await transaction_service.create_transaction(db, payload)
    return ApiResponse.success(data=transaction)
