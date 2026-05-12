import { Metadata } from "next";
import QuestDashboard from "@/components/quests/QuestDashboard";

export const metadata: Metadata = {
  title: "Quests | Inaam",
  description: "Embark on adventures to earn rare achievements and rewards.",
};

export default function QuestsPage() {
  return <QuestDashboard />;
}
