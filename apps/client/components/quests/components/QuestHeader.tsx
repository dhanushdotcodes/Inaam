"use client";

import React from "react";
import { Trophy } from "lucide-react";
import DashboardHeader from "../../layout/DashboardHeader";

interface QuestHeaderProps {
  completedCount: number;
  totalCount: number;
}

export default function QuestHeader({ completedCount, totalCount }: QuestHeaderProps) {
  return (
    <DashboardHeader 
      title="Quests"
      description="Complete tasks across all your rewards to unlock legendary treasures."
    >
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          {completedCount}/{totalCount}
        </span>
      </div>
    </DashboardHeader>
  );
}
