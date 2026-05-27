import asyncio
import random
from datetime import datetime, timedelta, timezone
from faker import Faker
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import SessionLocal
from models.user import User
from models.reward import Reward
from models.task import Task
from models.transaction import PointTransaction
from models.enums import TaskDifficulty, TransactionType
from services.auth import hash_password

fake = Faker()

async def clear_other_users(db: AsyncSession, keep_email: str):
    """Delete all users except the specified email. DB CASCADE handles related records."""
    print(f"Cleaning up database: removing all users except {keep_email}...")
    await db.execute(delete(User).where(User.email != keep_email))
    await db.commit()

async def clear_existing_data(db: AsyncSession, user_id: str):
    """Clear existing data for the given user to ensure idempotency."""
    print(f"Clearing existing data for user {user_id}...")
    await db.execute(delete(PointTransaction).where(PointTransaction.user_id == user_id))
    await db.execute(delete(Task).where(Task.user_id == user_id))
    await db.execute(delete(Reward).where(Reward.user_id == user_id))
    await db.commit()

def create_reward(user_id, is_claimed, cost_points=None):
    if cost_points is None:
        cost_points = random.randint(100, 1000)
    claimed_at = datetime.now(timezone.utc) - timedelta(days=random.randint(0, 10)) if is_claimed else None
    return Reward(
        user_id=user_id,
        title=fake.catch_phrase(),
        description=fake.sentence(),
        cost_points=cost_points,
        claimed_at=claimed_at
    )

def create_task(user_id, is_completed):
    difficulty = random.choice(list(TaskDifficulty))
    completed_at = datetime.now(timezone.utc) - timedelta(days=random.randint(0, 10)) if is_completed else None
    return Task(
        user_id=user_id,
        title=fake.bs().capitalize(),
        description=fake.text(max_nb_chars=100),
        difficulty=difficulty,
        points=random.randint(100, 500),  # Increased points to help offset prize costs
        completed=is_completed,
        completed_at=completed_at
    )

async def seed():
    print("Starting database seed...")
    async with SessionLocal() as db:
        email = "test@gmail.com"
        username = "testuser"
        
        # 1. Ensure test user exists and clear out everyone else
        await clear_other_users(db, email)
        
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if user:
            print(f"User {email} already exists. Updating password and clearing old data.")
            user.hashed_password = hash_password("Test@Password")
            await db.commit()
            await clear_existing_data(db, user.id)
        else:
            print(f"Creating new user {email}...")
            user = User(
                username=username,
                email=email,
                hashed_password=hash_password("Test@Password")
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        # 3. Generate Tasks
        print("Generating tasks...")
        tasks = []
        # 20+ completed tasks
        for _ in range(random.randint(25, 35)):
            tasks.append(create_task(user.id, is_completed=True))
            
        # 20+ active (uncompleted) tasks
        for _ in range(random.randint(25, 35)):
            tasks.append(create_task(user.id, is_completed=False))

        db.add_all(tasks)
        await db.commit()
        for t in tasks:
            await db.refresh(t)

        # Calculate total earned points so we don't overspend
        total_earned = sum(t.points for t in tasks if t.completed)
        print(f"Total points earned from tasks: {total_earned}")

        # 4. Generate Prizes based on available balance
        print("Generating prizes...")
        balance = total_earned
        rewards = []
        for _ in range(random.randint(20, 25)):
            cost = random.randint(100, 500)
            if balance >= cost:
                balance -= cost
                rewards.append(create_reward(user.id, is_claimed=True, cost_points=cost))
            else:
                rewards.append(create_reward(user.id, is_claimed=False, cost_points=cost))
                
        # unclaimed prizes
        for _ in range(random.randint(20, 25)):
            rewards.append(create_reward(user.id, is_claimed=False))
            
        # Add the new prizes to DB
        db.add_all(rewards)
        await db.commit()
        for r in rewards:
            await db.refresh(r)
        # 5. Generate Point Transactions
        print("Generating point transactions...")
        transactions = []
        
        # Transactions for completed tasks (EARNED)
        for task in tasks:
            if task.completed:
                pt = PointTransaction(
                    user_id=user.id,
                    type=TransactionType.EARNED,
                    points=task.points,
                    task_id=task.id,
                    description=f"Completed task: {task.title}"
                )
                pt.created_at = task.completed_at
                transactions.append(pt)
                
        # Transactions for claimed prizes (SPENT)
        for reward in rewards:
            if reward.claimed_at is not None:
                pt = PointTransaction(
                    user_id=user.id,
                    type=TransactionType.SPENT,
                    points=reward.cost_points,
                    reward_id=reward.id,
                    description=f"Claimed prize: {reward.title}"
                )
                pt.created_at = reward.claimed_at
                transactions.append(pt)
        
        db.add_all(transactions)
        await db.commit()
        
        print(f"Seed complete!")
        print(f"Stats: 1 User, {len(rewards)} Rewards, {len(tasks)} Tasks, {len(transactions)} Transactions.")
        print(f"Final User Balance: {balance} points")

if __name__ == "__main__":
    asyncio.run(seed())
