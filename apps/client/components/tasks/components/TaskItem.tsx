"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import DifficultyBadge from "./DifficultyBadge";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
  rewardTitle: string | null;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
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

export default function TaskItem({ task, rewardTitle, onToggle, onDelete }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isObjective = task.reward_id !== null;
  const hasDescription = !!task.description?.trim();
  
  return (
    <div className="relative w-full">
      <motion.div
        layout
        variants={itemVariants}
        className={cn(
          "w-full bg-card border border-border shadow-sm transition-all group cursor-pointer select-none relative",
          // Desktop Grid Layout (md viewport and up)
          "md:grid md:grid-cols-[40px_1fr_220px_120px] md:gap-6 md:items-center md:min-h-22 md:px-6 md:py-4 md:rounded-[24px]",
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

          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 h-6 rounded-full border border-primary/10 flex items-center justify-center">
            {task.points} Pts
          </span>
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
        </div>        {/* 4. Description Accordion Container (Full width across all grid columns) */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="description-accordion"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 400,
                    damping: 35
                  },
                  opacity: { duration: 0.2 }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 40
                  },
                  opacity: { duration: 0.15 }
                }
              }}
              className="col-span-full overflow-hidden border-t border-border/60 bg-muted/10 -mx-4 -mb-4 mt-3 p-4 md:-mx-6 md:-mb-4 md:mt-4 md:px-6 md:py-4 md:pl-16 rounded-b-[24px]"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start w-full">
                {/* Description Text */}
                <p className={cn(
                  "text-xs leading-relaxed flex-1 font-medium whitespace-pre-wrap",
                  task.description?.trim() ? "text-muted-foreground" : "text-muted-foreground/60 italic"
                )}>
                  {task.description?.trim() || "No description provided for this task."}
                </p>
 
                {/* Accordion Actions (Delete Button) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent completing the task
                    setIsDeleteDialogOpen(true);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive text-destructive hover:text-white text-[10px] font-black uppercase tracking-wider transition-all duration-300 shrink-0 outline-none cursor-pointer"
                  )}
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete {isObjective ? "Objective" : "Bounty"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
 
      {/* 5. Saturn Chevron Bulge Trigger Button (Center-aligned on the bottom border) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent completing the task
          setIsExpanded(!isExpanded);
        }}
        className={cn(
          "absolute -bottom-1 right-12 translate-y-1/2 z-30 group/saturn",
          "flex items-center justify-center w-12 h-4 rounded-b-full border border-t-0 border-border bg-card shadow-md",
          " transition-all duration-300 cursor-pointer outline-none overflow-visible"
        )}
      >

        {/* Planet Core (Chevron Icon) */}
        <ChevronDown className={cn(
          "size-3 text-muted-foreground transition-all duration-500 z-10 mt-0.5",
          "group-hover/saturn:text-primary group-hover/saturn:scale-110",
          isExpanded && "rotate-180 text-primary"
        )} />
      </button>

      {/* 6. Custom Alert Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Delete ${isObjective ? "Objective" : "Bounty"}`}
        description={`Are you sure you want to permanently delete this ${
          isObjective ? "objective" : "bounty"
        }? This action is irreversible.`}
        cancelText="Cancel"
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await onDelete(task);
            setIsDeleteDialogOpen(false);
          } catch (err) {
            console.error("Task deletion failed:", err);
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </div>
  );
}
