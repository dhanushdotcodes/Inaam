import { Metadata } from "next";
import QuestsDashboard from "@/components/rewards/QuestsDashboard";

export const metadata: Metadata = {
  title: "Quests | Inaam",
  description: "Complete objectives and earn rewards.",
};

export default function QuestsPage() {
  return <QuestsDashboard />;
}
