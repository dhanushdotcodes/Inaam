from typing import List, Optional

class RankConfig:
    def __init__(
        self,
        name: str,
        lifetime_xp: int,
        tasks_completed: int,
        perfect_weeks: int = 0
    ):
        self.name = name
        self.lifetime_xp = lifetime_xp
        self.tasks_completed = tasks_completed
        self.perfect_weeks = perfect_weeks

RANKS: List[RankConfig] = [
    RankConfig("Wanderer I", 0, 0, 0),
    RankConfig("Wanderer II", 900, 5, 0),
    RankConfig("Wanderer III", 2100, 12, 0),
    
    RankConfig("Initiate I", 4500, 20, 0),
    RankConfig("Initiate II", 7500, 35, 0),
    RankConfig("Initiate III", 12000, 50, 0),
    
    RankConfig("Apprentice I", 18000, 75, 0),
    RankConfig("Apprentice II", 25500, 110, 0),
    RankConfig("Apprentice III", 36000, 150, 0),
    
    RankConfig("Spellbinder I", 48000, 220, 0),
    RankConfig("Spellbinder II", 60000, 280, 0),
    RankConfig("Spellbinder III", 78000, 350, 0),
    
    RankConfig("Wizard I", 105000, 450, 0),
    RankConfig("Wizard II", 135000, 550, 0),
    RankConfig("Wizard III", 180000, 700, 3),
    
    RankConfig("Archmage I", 240000, 900, 0),
    RankConfig("Archmage II", 330000, 1100, 0),
    RankConfig("Archmage III", 450000, 1400, 7),
    
    RankConfig("Oracle I", 660000, 1800, 0),
    RankConfig("Oracle II", 900000, 2300, 0),
    RankConfig("Oracle III", 1200000, 3000, 10),
    
    RankConfig("Mythic I", 1650000, 4000, 0),
    RankConfig("Mythic II", 2250000, 5500, 0),
    RankConfig("Mythic III", 3000000, 7000, 14),
    
    RankConfig("Ascendant I", 4500000, 10000, 0),
    RankConfig("Ascendant II", 6000000, 14000, 0),
    RankConfig("Ascendant III", 9000000, 18000, 20),
    
    RankConfig("Chronomancer", 15000000, 25000, 27),
]

def get_highest_rank(
    lifetime_xp: int,
    tasks_completed: int,
    perfect_weeks: int
) -> RankConfig:
    """Returns the highest rank the user qualifies for."""
    highest_rank = RANKS[0]
    for rank in RANKS:
        if (
            lifetime_xp >= rank.lifetime_xp and
            tasks_completed >= rank.tasks_completed and
            perfect_weeks >= rank.perfect_weeks
        ):
            highest_rank = rank
        else:
            # Since RANKS is ordered by progression, if they fail one, they fail all subsequent ranks.
            # However, some constraints might theoretically pass later if they were unbalanced, 
            # but since they strictly increase, we can just break here.
            break
            
    return highest_rank

def get_next_rank(current_rank_name: str) -> Optional[RankConfig]:
    """Get the next rank in the ladder."""
    for i, rank in enumerate(RANKS):
        if rank.name == current_rank_name:
            if i + 1 < len(RANKS):
                return RANKS[i + 1]
            return None
    return None
