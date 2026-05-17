"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import DifficultyBadge from "./DifficultyBadge";

interface TaskItemProps {
  task: Task;
  rewardTitle: string | null;
  onToggle: (task: Task) => void;
}

/**
 * TaskItem component — Displays an individual task (Bounty or Quest Objective) in a premium,
 * highly-structured interactive row conforming to the new-ui-rules.json specifications.
 */
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: -16, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 32
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 0,
    overflow: "hidden",
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 38
    }
  }
};

export default function TaskItem({ task, rewardTitle, onToggle }: TaskItemProps) {
  const isObjective = task.reward_id !== null;
  
  return (
    <motion.div
      layout
      variants={itemVariants}
      className={cn(
        "w-full bg-card border border-border shadow-sm transition-all group cursor-pointer select-none",
        // Desktop Grid Layout (md viewport and up)
        "md:grid md:grid-cols-[40px_1fr_220px_120px_48px] md:gap-6 md:items-center md:min-h-22 md:px-6 md:py-4 md:rounded-[24px]",
        // Mobile Stacked Layout (below md viewport)
        "flex flex-col gap-3 p-4 rounded-[24px]",
        // Completion/Inactive state
        task.completed && "opacity-60 bg-muted/20 shadow-none border-border/50"
      )}
      onClick={() => onToggle(task)}
    >
      {/* 1. Selection & Content (Grouped together on mobile, split inside grid on desktop) */}
      <div className="flex items-center gap-3 md:contents">
        
        {/* Selection Column (Checkbox primitive) */}
        <div className="flex items-center justify-center shrink-0 w-10 h-10 select-none">
          <div className="focus:outline-none shrink-0">
            {task.completed ? (
              <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 transition-colors">
                <CheckCircle2 className="size-6 stroke-[2px]" />
              </div>
            ) : (
              <div className="p-1 rounded-full bg-muted border border-border transition-colors hover:border-primary/50 text-transparent">
                <Circle className="size-6 stroke-[2px]" />
              </div>
            )}
          </div>
        </div>

        {/* Content Column (Title Hierarchy) */}
        <div className="flex-1 min-w-0 md:flex md:flex-col md:gap-0.5">
          <span
            className={cn(
              "text-base font-bold transition-all tracking-tight leading-snug line-clamp-2",
              task.completed
                ? "text-muted-foreground line-through"
                : "text-foreground transition-colors"
            )}
          >
            {task.title}
          </span>
          {isObjective && rewardTitle && (
            <span className="text-xs font-medium text-neutral-400 tracking-tight block mt-0.5">
              Quest: {rewardTitle}
            </span>
          )}
        </div>

      </div>

      {/* 2. Metadata Column (Difficulty badge, Reward Tag, and Quest association) */}
      <div className="flex items-center gap-2 flex-wrap md:w-55 md:shrink-0 md:justify-start md:pl-0 pl-13">
        <DifficultyBadge difficulty={task.difficulty} />
        
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 h-6 rounded-full border flex items-center justify-center bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-muted-foreground">
          {isObjective ? "Objective" : "Bounty"}
        </span>

        {isObjective ? null : (
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 h-6 rounded-full border border-primary/10 flex items-center justify-center">
            {task.points} Pts
          </span>
        )}
      </div>

      {/* 3. Status Column (Status Pill primitive) */}
      <div className="flex items-center md:w-30 md:justify-center md:pl-0 pl-13 md:shrink-0">
        <span className={cn(
          "h-8 px-3.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center border transition-all duration-300",
          task.completed 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-primary/5 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
        )}>
          {task.completed ? "Completed" : "Active"}
        </span>
      </div>

      {/* 4. Actions Column (Lightweight contextual placeholder for desktop alignment) */}
      <div className="hidden md:flex md:items-center md:justify-center md:w-12 md:shrink-0">
        <div className="w-5 h-5 rounded-full bg-muted/40 group-hover:bg-muted/80 flex items-center justify-center transition-colors">
          <div className="size-1.5 rounded-full bg-muted-foreground/60 group-hover:bg-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
