import { Metadata } from "next";
import PrizesDashboard from "@/components/rewards/PrizesDashboard";

export const metadata: Metadata = {
  title: "Prizes | Inaam",
  description: "Redeem your points for exclusive prizes.",
};

export default function PrizesPage() {
  return <PrizesDashboard />;
}
