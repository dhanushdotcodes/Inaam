"use client";

import React from "react";
import { AnimatePresence } from "motion/react";
import type { Task, Reward } from "@/types";
import QuestItem from "./QuestItem";

interface QuestListProps {
  tasks: Task[];
  rewards: Reward[];
  onToggle: (task: Task) => void;
}

export default function QuestList({ tasks, rewards, onToggle }: QuestListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-500">No quests found matching your criteria.</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const getRewardTitle = (rewardId: string) => {
    return rewards.find(r => r.id === rewardId)?.title || "Unknown Reward";
  };

  return (
    <div className="grid gap-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <QuestItem 
            key={task.id} 
            task={task} 
            rewardTitle={getRewardTitle(task.reward_id)} 
            onToggle={onToggle} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
