import { Metadata } from "next";
import TaskDashboard from "@/components/tasks/TaskDashboard";

export const metadata: Metadata = {
  title: "Tasks | Inaam",
  description: "Complete bounties and objectives to earn points and unlock prizes.",
};

export default function TasksPage() {
  return <TaskDashboard />;
}
