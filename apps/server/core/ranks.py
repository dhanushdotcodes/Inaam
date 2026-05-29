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
    RankConfig("Wanderer II", 300, 5, 0),
    RankConfig("Wanderer III", 700, 12, 0),
    
    RankConfig("Initiate I", 1500, 20, 0),
    RankConfig("Initiate II", 2500, 35, 0),
    RankConfig("Initiate III", 4000, 50, 0),
    
    RankConfig("Apprentice I", 6000, 75, 0),
    RankConfig("Apprentice II", 8500, 110, 0),
    RankConfig("Apprentice III", 12000, 150, 0),
    
    RankConfig("Spellbinder I", 16000, 220, 0),
    RankConfig("Spellbinder II", 20000, 280, 0),
    RankConfig("Spellbinder III", 26000, 350, 0),
    
    RankConfig("Wizard I", 35000, 450, 0),
    RankConfig("Wizard II", 45000, 550, 0),
    RankConfig("Wizard III", 60000, 700, 3),
    
    RankConfig("Archmage I", 80000, 900, 0),
    RankConfig("Archmage II", 110000, 1100, 0),
    RankConfig("Archmage III", 150000, 1400, 7),
    
    RankConfig("Oracle I", 220000, 1800, 0),
    RankConfig("Oracle II", 300000, 2300, 0),
    RankConfig("Oracle III", 400000, 3000, 10),
    
    RankConfig("Mythic I", 550000, 4000, 0),
    RankConfig("Mythic II", 750000, 5500, 0),
    RankConfig("Mythic III", 1000000, 7000, 14),
    
    RankConfig("Ascendant I", 1500000, 10000, 0),
    RankConfig("Ascendant II", 2000000, 14000, 0),
    RankConfig("Ascendant III", 3000000, 18000, 20),
    
    RankConfig("Chronomancer", 5000000, 25000, 27),
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
