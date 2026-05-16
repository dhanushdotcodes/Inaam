"use client";

import React, { useMemo } from "react";
import { Coins } from "lucide-react";
import { motion } from "motion/react";
import type { Task } from "@/types";

interface UnclaimedPointsProps {
  tasks: Task[];
}

/**
 * UnclaimedPoints component — Displays the sum of points available from uncompleted tasks.
 * Simplified for dashboard view.
 */
export default function UnclaimedPoints({ tasks }: UnclaimedPointsProps) {
  const unclaimedPoints = useMemo(() => {
    return tasks
      .filter((task) => !task.completed)
      .reduce((sum, task) => sum + (task.points || 0), 0);
  }, [tasks]);

  if (unclaimedPoints <= 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 shadow-xs"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-blue text-white shadow-sm">
        <Coins className="w-4 h-4 stroke-[2px]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue/70 leading-none mb-1">
          Unclaimed Bounty
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-brand-dark dark:text-brand-light leading-none">
            {unclaimedPoints.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Points</span>
        </div>
      </div>
    </motion.div>
  );
}
