"use client";

import React from "react";
import { Trophy, Plus } from "lucide-react";
import DashboardHeader from "../../layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import PointsDisplay from "../../shared/PointsDisplay";

interface TaskHeaderProps {
  completedCount: number;
  totalCount: number;
  onNewTask: () => void;
}

export default function TaskHeader({ completedCount, totalCount, onNewTask }: TaskHeaderProps) {
  return (
    <DashboardHeader 
      title="Tasks"
      description="Complete bounties and objectives to earn points and unlock prizes."
    >
      <div className="flex items-center gap-3">
        <PointsDisplay />
        <Button 
          variant="contained"
          onClick={onNewTask}
          startIcon={<Plus />}
        >
          New Bounty
        </Button>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border">
          <Trophy className="size-4 text-amber-500" />
          <span className="text-xs font-bold text-foreground">
            {completedCount}/{totalCount} Completed
          </span>
        </div>
      </div>
    </DashboardHeader>
  );
}
