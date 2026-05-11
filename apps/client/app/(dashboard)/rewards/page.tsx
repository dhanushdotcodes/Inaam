import { Metadata } from "next";
import RewardsDashboard from "@/components/rewards/RewardsDashboard";

export const metadata: Metadata = {
  title: "Rewards | Inaam",
  description: "View and manage your rewards and tasks.",
};

/**
 * Rewards Page — Server component that renders the RewardsDashboard.
 */
export default function RewardsPage() {
  return <RewardsDashboard />;
}
