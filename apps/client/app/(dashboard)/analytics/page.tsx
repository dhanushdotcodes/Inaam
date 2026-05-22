import { Metadata } from "next";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics | Inaam",
  description: "Track your productivity, check task completion rates, and view your daily activity stats.",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
