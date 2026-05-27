"use client";

import { AnimatePresence, motion } from "motion/react";
import { Pin } from "lucide-react";
import type { Task } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
  onPin: (task: Task) => void | Promise<void>;
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

export default function TaskList({ tasks, onToggle, onDelete, onPin, filter }: TaskListProps) {
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

  const pinnedTasks = sortedTasks.filter((t) => t.pinned && !t.completed);
  const unpinnedTasks = sortedTasks.filter((t) => !(t.pinned && !t.completed));



  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filter}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid gap-6 w-full relative"
      >
        {sortedTasks.length > 0 ? (
          <>
            {pinnedTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={onToggle} 
                onDelete={onDelete}
                onPin={onPin}
              />
            ))}

            {pinnedTasks.length > 0 && unpinnedTasks.length > 0 && (
              <div className="relative flex items-center py-2 col-span-full select-none">
                <div className="grow border-t border-border/40"></div>
                <span className="shrink-0 mx-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 bg-background/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-border/60 shadow-xs flex items-center gap-1.5">
                  <Pin className="size-3 text-neutral-400 -rotate-45" /> Other Tasks
                </span>
                <div className="grow border-t border-border/40"></div>
              </div>
            )}

            {unpinnedTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={onToggle} 
                onDelete={onDelete}
                onPin={onPin}
              />
            ))}
          </>
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
