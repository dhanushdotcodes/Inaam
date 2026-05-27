"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronDown, Trash2, Repeat, Pencil, Pin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import DifficultyBadge from "./DifficultyBadge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import TaskFormDialog from "../dialogs/TaskFormDialog";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void | Promise<void>;
  onDelete: (task: Task) => Promise<void>;
  onPin: (task: Task) => void | Promise<void>;
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

export default function TaskItem({ task, onToggle, onDelete, onPin }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (task.completed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExpanded(false);
    }
  }, [task.completed]);


  const hasDescription = !!task.description?.trim();
  
  const formatRecurrenceDays = (daysStr: string | null) => {
    if (!daysStr) return null;
    const daysArr = daysStr.split(",").map(Number).sort((a,b) => a-b);
    if (daysArr.length === 7) return "Everyday";
    if (daysArr.length === 5 && daysArr.every((d, i) => d === i)) return "Weekdays";
    if (daysArr.length === 2 && daysArr.includes(5) && daysArr.includes(6)) return "Weekends";
    
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return daysArr.map(d => dayNames[d]).join(", ");
  };

  const recurrenceText = task.is_recurring ? formatRecurrenceDays(task.recurrence_days) : null;
  
  return (
    <div className="relative w-full">
      <motion.div
        layout
        variants={itemVariants}
        transition={{
          layout: {
            type: "tween",
            ease: "easeInOut",
            duration: 0.25
          }
        }}
        className={cn(
          "w-full bg-card border border-border shadow-sm transition-all group select-none relative",
          task.completed ? "cursor-default" : "cursor-pointer",
          // Desktop Grid Layout (md viewport and up)
          "md:grid md:grid-cols-[40px_1fr_auto_80px] md:gap-x-6 md:gap-y-0 md:items-center md:min-h-22 md:px-6 md:py-4 md:rounded-[24px]",
          // Mobile Stacked Layout (below md viewport)
          "flex flex-col gap-3 p-4 rounded-[24px]",
          // Completion/Inactive state
          task.completed && "opacity-60 bg-muted/20 shadow-none border-border/50"
        )}
        onClick={async () => {
          if (isToggling || task.completed) return;
          setIsToggling(true);
          try {
            await onToggle(task);
          } catch (err) {
            console.error("Task toggle failed:", err);
          } finally {
            setIsToggling(false);
          }
        }}
      >
        {/* 1. Selection & Content (Grouped together on mobile, split inside grid on desktop) */}
        <div className="flex items-center gap-3 md:contents">
          
          {/* Selection Column (Checkbox primitive) */}
          <div className="flex items-center justify-center shrink-0 w-10 h-10 select-none">
            <div className="focus:outline-none shrink-0">
              {isToggling ? (
                <div className="p-1 rounded-full bg-muted border border-border text-primary flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  >
                    <Circle className="size-6 stroke-[2px] opacity-40 animate-pulse text-primary" />
                  </motion.div>
                </div>
              ) : task.completed ? (
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
                "text-base font-bold transition-all tracking-tight leading-snug",
                isExpanded ? "line-clamp-none" : "line-clamp-2",
                task.completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground transition-colors"
              )}
            >
              {task.title}
            </span>

          </div>

          {/* Mobile Actions (Hidden on Desktop) */}
          <div className="flex md:hidden shrink-0">
            {!task.completed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className={cn(
                  "h-7 w-7 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-300 outline-none cursor-pointer",
                  isExpanded && "bg-muted text-primary border-primary/20"
                )}
                title={isExpanded ? "Collapse Details" : "Expand Details"}
              >
                <ChevronDown className={cn(
                  "size-3.5 transition-transform duration-300",
                  isExpanded && "rotate-180 text-primary"
                )} />
              </button>
            )}
          </div>

        </div>
        {/* 2. Metadata Column (Difficulty badge, Reward Tag, and Quest association) */}
        <div className="hidden md:flex items-center gap-2 md:shrink-0 md:justify-start md:pl-0 pl-13">
          <DifficultyBadge difficulty={task.difficulty} />
          
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 h-6 rounded-full border flex items-center justify-center bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-muted-foreground">
            Bounty
          </span>

          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 h-6 rounded-full border border-primary/10 flex items-center justify-center">
            {task.points} Pts
          </span>
        </div>
        {/* 3. Actions Column */}
        <div className="hidden md:flex items-center gap-2 md:w-20 md:justify-end md:shrink-0">
          {!task.completed && (
            <>
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await onPin(task);
                  } catch (err) {
                    console.error("Pin toggle failed:", err);
                  }
                }}
                className={cn(
                  "h-7 w-7 rounded-xl border transition-all duration-300 outline-none cursor-pointer shrink-0 flex items-center justify-center",
                  task.pinned
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title={task.pinned ? "Unpin Task" : "Pin Task"}
              >
                <Pin className={cn(
                  "size-3.5 transition-transform duration-300",
                  task.pinned && "-rotate-45 fill-current"
                )} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent completing the task
                  setIsExpanded(!isExpanded);
                }}
                className={cn(
                  "h-7 w-7 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-300 outline-none cursor-pointer shrink-0",
                  isExpanded && "bg-muted text-primary border-primary/20"
                )}
                title={isExpanded ? "Collapse Details" : "Expand Details"}
              >
                <ChevronDown className={cn(
                  "size-3.5 transition-transform duration-300",
                  isExpanded && "rotate-180 text-primary"
                )} />
              </button>
            </>
          )}
        </div>

        {/* 4. Description Accordion Container */}
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
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.25
                  },
                  opacity: { duration: 0.15 }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: {
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.2
                  },
                  opacity: { duration: 0.1 }
                }
              }}
              // Outer container: ZERO padding, margins, or borders! Only col-span-full and overflow-hidden.
              className="col-span-full overflow-hidden -mx-4 -mb-4 md:-mx-6 md:-mb-4"
            >
              {/* Inner container: holds the background, border, padding, and negative margins to align with card boundary */}
              <div className="border-t border-border/60 bg-muted/10 mt-1.5 p-4 md:mt-2 md:px-6 md:py-4 md:pl-16 rounded-b-[24px]">
                {/* Mobile View Layout (Flex Column) */}
                <div className="flex flex-col gap-4 md:hidden">
                  {/* Section 1: Description (if present) */}
                  {hasDescription && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Description</span>
                      <p className="text-xs leading-relaxed text-foreground font-medium whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  )}

                  {/* Section 2: Metadata (Difficulty, Type, Points, Recurrence) */}
                  <div className="flex flex-col gap-1.5 border-t border-border/40 pt-3 mt-1 first:border-0 first:pt-0 first:mt-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Task Details</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DifficultyBadge difficulty={task.difficulty} />
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 h-6 rounded-full border flex items-center justify-center bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-muted-foreground">
                        Bounty
                      </span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 h-6 rounded-full border border-primary/10 flex items-center justify-center">
                        {task.points} Pts
                      </span>
                      {recurrenceText && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 h-6 rounded-full border flex items-center justify-center bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400 gap-1">
                          <Repeat className="w-3 h-3" />
                          {recurrenceText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Actions (Pin/Edit/Delete) */}
                  {!task.completed && (
                    <div className="flex items-center gap-2 border-t border-border/40 pt-3 w-full">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await onPin(task);
                          } catch (err) {
                            console.error("Pin toggle failed:", err);
                          }
                        }}
                        className={cn(
                          "flex-1 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 outline-none cursor-pointer text-xs font-semibold gap-1.5",
                          task.pinned
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                            : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Pin className={cn("size-3", task.pinned && "-rotate-45 fill-current")} />
                        {task.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditDialogOpen(true);
                        }}
                        className="flex-1 h-8 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-300 outline-none cursor-pointer text-xs font-semibold gap-1.5"
                      >
                        <Pencil className="size-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteDialogOpen(true);
                        }}
                        className="flex-1 h-8 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive text-destructive hover:text-white flex items-center justify-center transition-all duration-300 outline-none cursor-pointer text-xs font-semibold gap-1.5"
                      >
                        <Trash2 className="size-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop View Layout (Hidden on Mobile) */}
                <div className="hidden md:flex md:flex-col md:gap-3">
                  {hasDescription && (
                    <p className="text-xs leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {recurrenceText && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 h-6 rounded-full border flex items-center justify-center bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400 gap-1">
                          <Repeat className="w-3 h-3" />
                          {recurrenceText}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!task.completed && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditDialogOpen(true);
                            }}
                            className="h-7 px-3 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-300 outline-none cursor-pointer text-xs font-semibold gap-1.5"
                          >
                            <Pencil className="size-3" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-7 px-3 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive text-destructive hover:text-white flex items-center justify-center transition-all duration-300 outline-none cursor-pointer text-xs font-semibold gap-1.5"
                          >
                            <Trash2 className="size-3" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* 6. Custom Alert Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Bounty"
        description="Are you sure you want to permanently delete this bounty? This action is irreversible."
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
      <TaskFormDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        initialData={task} 
        onSuccess={() => window.location.reload()} 
      />
    </div>
  );
}
