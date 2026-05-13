import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "../layout/DashboardHeader";
import PointsDisplay from "../shared/PointsDisplay";

interface RewardsHeaderProps {
  onNewReward: () => void;
}

export default function RewardsHeader({ onNewReward }: RewardsHeaderProps) {
  return (
    <DashboardHeader
      title="Vault"
      description="Manage your unlocked rewards and track task progress."
    >
      <div className="flex items-center gap-3">
        <PointsDisplay />
        <Button id="create-reward-button" onClick={onNewReward}>
          <Plus className="mr-2 h-4 w-4" />
          New Reward
        </Button>
      </div>
    </DashboardHeader>
  );
}
