import React from "react";
import { TaskDifficulty } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: TaskDifficulty;
  className?: string;
}

const difficultyConfig = {
  [TaskDifficulty.TINY]: {
    label: "Tiny",
    color: "bg-difficulty-tiny/10 text-difficulty-tiny border-difficulty-tiny/20",
  },
  [TaskDifficulty.SMALL]: {
    label: "Small",
    color: "bg-difficulty-small/10 text-difficulty-small border-difficulty-small/20",
  },
  [TaskDifficulty.MEDIUM]: {
    label: "Medium",
    color: "bg-difficulty-medium/10 text-difficulty-medium border-difficulty-medium/20",
  },
  [TaskDifficulty.HARD]: {
    label: "Hard",
    color: "bg-difficulty-hard/10 text-difficulty-hard border-difficulty-hard/20",
  },
  [TaskDifficulty.EXTREME]: {
    label: "Extreme",
    color: "bg-difficulty-extreme/10 text-difficulty-extreme border-difficulty-extreme/20",
  },
};

export default function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig[TaskDifficulty.MEDIUM];

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
