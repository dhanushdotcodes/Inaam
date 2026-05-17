"use client";

import React, { useMemo, useState } from "react";
import { Coins, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";

interface UnclaimedPointsProps {
  tasks: Task[];
}

/**
 * UnclaimedPoints component — Displays a premium, grid-aligned summary of unclaimed points 
 * from active bounties and objectives. Dismissible and fully visually consistent with task rows.
 */
export default function UnclaimedPoints({ tasks }: UnclaimedPointsProps) {
  const [isVisible, setIsVisible] = useState(true);

  const unclaimedPoints = useMemo(() => {
    return tasks
      .filter((task) => !task.completed)
      .reduce((sum, task) => sum + (task.points || 0), 0);
  }, [tasks]);

  const activeCount = useMemo(() => {
    return tasks.filter((task) => !task.completed).length;
  }, [tasks]);

  if (!isVisible || unclaimedPoints <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full overflow-hidden"
      >
        <div 
          className="grid grid-cols-[48px_1fr_auto] gap-4 items-center min-h-22 px-6 py-5 rounded-[24px] bg-brand-blue/5 border border-brand-blue/10 dark:bg-brand-blue/10 dark:border-brand-blue/20 shadow-xs"
          data-slot="bounty-summary-row"
        >
          {/* 1. Icon Region (Col 1) - Sized and centered to align with task checkbox column */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-sm shrink-0 select-none">
            <Coins className="w-5 h-5 stroke-[2.5px]" />
          </div>

          {/* 2. Content Region (Col 2) - Primary/Secondary/Tertiary Hierarchy */}
          <div className="flex flex-col gap-1 min-w-0">
            {/* Secondary (Summary Label) */}
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 leading-none">
              Unclaimed Bounty
            </span>
            {/* Primary (Points Value) */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground leading-none">
                {unclaimedPoints.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Points</span>
            </div>
            {/* Tertiary (Supporting Metadata) */}
            <span className="text-xs text-muted-foreground leading-snug">
              Available from {activeCount} active {activeCount === 1 ? "bounty" : "bounties"}.
            </span>
          </div>

          {/* 3. Action Region (Col 3) - Symmetrical Close Button */}
          <div className="flex items-center justify-center">
            <Button
              variant="texted"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 rounded-xl"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
