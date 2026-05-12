import { Metadata } from "next";
import RewardsOverview from "@/components/rewards/RewardsOverview";

export const metadata: Metadata = {
  title: "Rewards | Inaam",
  description: "Monitor your reward earnings and manage your financial assets.",
};

export default function RewardsPage() {
  return <RewardsOverview />;
}
