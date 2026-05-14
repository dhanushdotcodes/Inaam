"""rename_reward_types_v2

Revision ID: a9a42456cd97
Revises: 02ddb3c83275
Create Date: 2026-05-14 13:02:45.500287

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a9a42456cd97'
down_revision: Union[str, Sequence[str], None] = '02ddb3c83275'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create new enum type
    op.execute("CREATE TYPE reward_type_v2 AS ENUM ('QUEST', 'PRIZE')")
    
    # Alter column with data migration
    op.execute("ALTER TABLE rewards ALTER COLUMN reward_type TYPE reward_type_v2 USING "
               "CASE WHEN reward_type::text = 'DIRECT' THEN 'QUEST'::reward_type_v2 "
               "ELSE 'PRIZE'::reward_type_v2 END")


def downgrade() -> None:
    # Alter column back with data migration
    op.execute("ALTER TABLE rewards ALTER COLUMN reward_type TYPE rewardtype USING "
               "CASE WHEN reward_type::text = 'QUEST' THEN 'DIRECT'::rewardtype "
               "ELSE 'ECONOMY'::rewardtype END")
    
    # Drop new enum type
    op.execute("DROP TYPE reward_type_v2")
