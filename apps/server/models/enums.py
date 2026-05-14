import enum


class RewardType(str, enum.Enum):
    """Type of reward."""
    QUEST = "QUEST"
    PRIZE = "PRIZE"


class TransactionType(str, enum.Enum):
    """Type of point transaction."""
    EARNED = "EARNED"
    SPENT = "SPENT"
    BONUS = "BONUS"
    PENALTY = "PENALTY"


class TaskDifficulty(str, enum.Enum):
    """Difficulty of a task (energy level cost)."""
    TINY = "TINY"
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    HARD = "HARD"
    EXTREME = "EXTREME"


class TaskType(str, enum.Enum):
    """Type of task."""
    BOUNTY = "BOUNTY"
    OBJECTIVE = "OBJECTIVE"
