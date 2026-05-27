"use client";

import { Plus } from "lucide-react";
import DashboardHeader from "../../layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import PointsDisplay from "../../shared/PointsDisplay";

interface TaskHeaderProps {
  onNewTask: () => void;
}

export default function TaskHeader({ onNewTask }: TaskHeaderProps) {
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
      </div>
    </DashboardHeader>
  );
}
