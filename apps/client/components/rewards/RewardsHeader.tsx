import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "../layout/DashboardHeader";

interface RewardsHeaderProps {
  onNewReward: () => void;
}

export default function RewardsHeader({ onNewReward }: RewardsHeaderProps) {
  return (
    <DashboardHeader
      title="Rewards"
      description="Manage your rewards and track task progress."
    >
      <Button id="create-reward-button" onClick={onNewReward}>
        <Plus className="mr-2 h-4 w-4" />
        New Reward
      </Button>
    </DashboardHeader>
  );
}
