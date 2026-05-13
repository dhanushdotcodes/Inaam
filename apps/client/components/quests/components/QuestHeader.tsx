"use client";

import React from "react";
import { Trophy, Plus } from "lucide-react";
import DashboardHeader from "../../layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import PointsDisplay from "../../shared/PointsDisplay";

interface QuestHeaderProps {
  completedCount: number;
  totalCount: number;
  onNewTask: () => void;
}

export default function QuestHeader({ completedCount, totalCount, onNewTask }: QuestHeaderProps) {
  return (
    <DashboardHeader 
      title="Quests"
      description="Complete tasks across all your rewards to unlock legendary treasures."
    >
      <div className="flex items-center gap-3">
        <PointsDisplay />
        <Button 
          variant="contained"
          onClick={onNewTask}
          startIcon={<Plus />}
        >
          New Quest
        </Button>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border">
          <Trophy className="size-4 text-amber-500" />
          <span className="text-xs font-bold text-foreground">
            {completedCount}/{totalCount} Achieved
          </span>
        </div>
      </div>
    </DashboardHeader>
  );
}
