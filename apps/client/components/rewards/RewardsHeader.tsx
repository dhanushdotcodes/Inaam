"use client";

import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardsHeaderProps {
  onNewReward: () => void;
  onLogout: () => void;
}

/**
 * RewardsHeader component — Handles the page title and actions.
 */
export default function RewardsHeader({
  onNewReward,
  onLogout,
}: RewardsHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold tracking-tight wrap-break-word break-all max-w-full">
          Rewards
        </h1>
        <p className="mt-1 text-sm text-muted-foreground wrap-break-word">
          Manage your rewards and track task progress.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button id="create-reward-button" onClick={onNewReward}>
          <Plus className="mr-2 h-4 w-4" />
          New Reward
        </Button>

        <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
