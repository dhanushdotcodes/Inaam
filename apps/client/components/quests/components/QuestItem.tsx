"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface QuestItemProps {
  task: Task;
  rewardTitle: string;
  onToggle: (task: Task) => void;
}

export default function QuestItem({ task, rewardTitle, onToggle }: QuestItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800",
        task.completed && "opacity-60"
      )}
      onClick={() => onToggle(task)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="focus:outline-none shrink-0">
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "text-sm wrap-break-word whitespace-normal break-all max-w-full transition-all",
              task.completed
                ? "text-zinc-400 line-through"
                : "text-zinc-900 dark:text-zinc-50 font-medium"
            )}
          >
            {task.title}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            {rewardTitle}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end">
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
          task.completed 
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
            : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        )}>
          {task.completed ? "Heroic" : "Available"}
        </span>
      </div>
    </motion.div>
  );
}
