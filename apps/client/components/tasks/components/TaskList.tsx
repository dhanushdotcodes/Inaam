"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Task, Reward } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  rewards: Reward[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
  filter: string;
}

// Container variants to stagger child entrances from top to bottom
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms stagger waterfall cascade
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    y: 16, // Slides down smoothly on exit
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const
    }
  }
};

export default function TaskList({ tasks, rewards, onToggle, onDelete, filter }: TaskListProps) {
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
    <AnimatePresence mode="wait">
      <motion.div
        key={filter}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid gap-4 w-full relative"
      >
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              rewardTitle={getRewardTitle(task.reward_id)} 
              onToggle={onToggle} 
              onDelete={onDelete}
            />
          ))
        ) : (
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: -12 },
              visible: { opacity: 1, y: 0 },
              exit: { opacity: 0 }
            }}
            className="flex flex-col items-center justify-center py-20 rounded-[24px] border border-dashed border-border bg-card/50 select-none"
          >
            <p className="text-sm text-muted-foreground font-bold tracking-tight">
              No tasks found matching your criteria.
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
