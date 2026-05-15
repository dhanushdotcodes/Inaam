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

export default function TaskItem({ task, rewardTitle, onToggle }: TaskItemProps) {
  const isObjective = task.reward_id !== null;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex items-center justify-between p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer min-w-1",
        task.completed && "opacity-60 bg-muted/20 shadow-none hover:shadow-none"
      )}
      onClick={() => onToggle(task)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="focus:outline-none shrink-0">
          {task.completed ? (
            <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-muted border border-border group-hover:border-primary transition-colors">
              <Circle className="size-5 text-transparent" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-base font-bold transition-all tracking-tight",
                task.completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground group-hover:text-primary"
              )}
            >
              {task.title}
            </span>
            <DifficultyBadge difficulty={task.difficulty} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-[11px] font-bold uppercase tracking-widest",
              isObjective ? "text-neutral-500" : "text-zinc-500"
            )}>
              {isObjective ? `Objective related to: ${rewardTitle || "Quest"}` : "Bounty"}
            </span>
            {isObjective ? null :
              <>
              <span className="text-[11px] font-bold text-muted-foreground">•</span>
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                {task.points} Points
              </span>
              </>
            }
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end shrink-0 ml-4">
        <span className={cn(
          "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border",
          task.completed 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-primary text-primary-foreground border-primary"
        )}>
          {task.completed ? "Completed" : "Active"}
        </span>
      </div>
    </motion.div>
  );
}
