"""add_user_id_to_all_models

Revision ID: 7deccecb3d81
Revises: a9a42456cd97
Create Date: 2026-05-18 20:53:54.888959

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7deccecb3d81'
down_revision: Union[str, Sequence[str], None] = 'a9a42456cd97'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Add user_id column as nullable first
    op.add_column('point_transactions', sa.Column('user_id', sa.Uuid(), nullable=True))
    op.add_column('rewards', sa.Column('user_id', sa.Uuid(), nullable=True))
    op.add_column('tasks', sa.Column('user_id', sa.Uuid(), nullable=True))

    # 2. Find the first user in the database
    connection = op.get_bind()
    result = connection.execute(sa.text("SELECT id FROM users LIMIT 1")).fetchone()
    
    if result:
        first_user_id = result[0]
        # 3. Associate all pre-existing rewards, tasks, and point_transactions with this user
        connection.execute(sa.text(f"UPDATE rewards SET user_id = '{first_user_id}' WHERE user_id IS NULL"))
        connection.execute(sa.text(f"UPDATE tasks SET user_id = '{first_user_id}' WHERE user_id IS NULL"))
        connection.execute(sa.text(f"UPDATE point_transactions SET user_id = '{first_user_id}' WHERE user_id IS NULL"))
    else:
        # If no users exist, we can't set an ID, so if there is pre-existing data, it will fail.
        # But in a clean db, there is no pre-existing data, so this is safe!
        pass

    # 4. Now make the column non-nullable
    op.alter_column('point_transactions', 'user_id', nullable=False)
    op.alter_column('rewards', 'user_id', nullable=False)
    op.alter_column('tasks', 'user_id', nullable=False)

    # 5. Create foreign keys
    op.create_foreign_key('fk_point_transactions_user_id', 'point_transactions', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_rewards_user_id', 'rewards', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_tasks_user_id', 'tasks', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_tasks_user_id', 'tasks', type_='foreignkey')
    op.drop_column('tasks', 'user_id')
    op.drop_constraint('fk_rewards_user_id', 'rewards', type_='foreignkey')
    op.drop_column('rewards', 'user_id')
    op.drop_constraint('fk_point_transactions_user_id', 'point_transactions', type_='foreignkey')
    op.drop_column('point_transactions', 'user_id')
