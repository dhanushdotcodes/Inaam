"use client";

import React, { useMemo } from "react";
import type { Task } from "@/types";

interface TaskListHeaderProps {
  tasks: Task[];
}

/**
 * TaskListHeader component — Displays desktop grid column headers aligned with TaskItems,
 * alongside a neutral-colored summary of unfinished tasks and unclaimed points at the top-right corner.
 */
export default function TaskListHeader({ tasks }: TaskListHeaderProps) {
  const unclaimedPoints = useMemo(() => {
    return tasks
      .filter((task) => !task.completed)
      .reduce((sum, task) => sum + (task.points || 0), 0);
  }, [tasks]);

  const activeCount = useMemo(() => {
    return tasks.filter((task) => !task.completed).length;
  }, [tasks]);

  if (tasks.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* Top summary row - neutral styled */}
      <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted-foreground/60">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/75">
          Bounties & Objectives
        </span>
        {activeCount > 0 && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/45">
            <span className="font-black text-muted-foreground/75">{activeCount}</span> {activeCount === 1 ? "task" : "tasks"} remaining • <span className="font-black text-muted-foreground/75">{unclaimedPoints.toLocaleString()}</span> pts waiting to be claimed!
          </span>
        )}
      </div>

      {/* Horizontal divider line */}
      <hr className="border-t border-border/50 w-full my-0.5" />

      {/* Desktop Column headers (hidden on mobile) */}
      <div className="hidden md:grid md:grid-cols-[40px_1fr_220px_80px] md:gap-x-6 px-6 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/35">
        <div className="text-center">Status</div>
        <div>Title</div>
        <div>Difficulty / Points</div>
        <div className="text-right">Actions</div>
      </div>
    </div>
  );
}
