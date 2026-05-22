import asyncio
from sqlalchemy import update
from core.database import SessionLocal, engine
from models.task import Task

async def backfill():
    print("Starting database backfill for Task.pinned...")
    async with SessionLocal() as session:
        async with session.begin():
            stmt = update(Task).where(Task.pinned.is_(None)).values(pinned=False)
            result = await session.execute(stmt)
            print(f"Successfully backfilled {result.rowcount} tasks to pinned=False.")
            
    # Clean up connection pool
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(backfill())
