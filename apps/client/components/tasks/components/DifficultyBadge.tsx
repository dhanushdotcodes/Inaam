import React from "react";
import { TaskDifficulty } from "@/types";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: TaskDifficulty;
  className?: string;
}

const difficultyConfig = {
  [TaskDifficulty.TINY]: {
    label: "Tiny",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  [TaskDifficulty.SMALL]: {
    label: "Small",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  [TaskDifficulty.MEDIUM]: {
    label: "Medium",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  [TaskDifficulty.HARD]: {
    label: "Hard",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  [TaskDifficulty.EXTREME]: {
    label: "Extreme",
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
};

export default function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty] || difficultyConfig[TaskDifficulty.MEDIUM];

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
