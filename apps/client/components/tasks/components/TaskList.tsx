"use client";

import React from "react";
import { AnimatePresence } from "motion/react";
import type { Task, Reward } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  rewards: Reward[];
  onToggle: (task: Task) => void;
}

export default function TaskList({ tasks, rewards, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-500">No tasks found matching your criteria.</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    // 1. Uncompleted tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // 2. If both uncompleted, sort by created_at desc
    if (!a.completed) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    // 3. If both completed, sort by completed_at desc
    const timeA = a.completed_at ? new Date(a.completed_at).getTime() : new Date(a.updated_at).getTime();
    const timeB = b.completed_at ? new Date(b.completed_at).getTime() : new Date(b.updated_at).getTime();
    return timeB - timeA;
  });

  const getRewardTitle = (rewardId: string | null) => {
    if (!rewardId) return null;
    return rewards.find(r => r.id === rewardId)?.title || null;
  };

  return (
    <div className="grid gap-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <TaskItem 
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
