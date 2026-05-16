"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface DashboardLoaderProps {
  message?: string;
}

/**
 * DashboardLoader component — Standardized loading view for dashboards.
 */
export default function DashboardLoader({ 
  message = "Syncing your data..." 
}: DashboardLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-zinc-300 dark:text-zinc-700" />
        <p className="text-sm font-bold tracking-tight uppercase text-zinc-400 dark:text-zinc-600">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
