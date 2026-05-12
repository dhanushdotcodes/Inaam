import { Metadata } from "next";
import RewardsDashboard from "@/components/rewards/RewardsDashboard";

export const metadata: Metadata = {
  title: "Vault | Inaam",
  description: "View and manage your vault items and tasks.",
};

/**
 * Vault Page — Server component that renders the RewardsDashboard.
 */
export default function VaultPage() {
  return <RewardsDashboard />;
}
