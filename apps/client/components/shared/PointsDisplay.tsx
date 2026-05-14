"use client";

import { useEffect, useState, useCallback } from "react";
import { Coins, Loader2 } from "lucide-react";
import { getPoints } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import TransactionHistoryDialog from "./TransactionHistoryDialog";

interface PointsDisplayProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * PointsDisplay component — Displays the current total points balance.
 * Follows EOS design guidelines with state-driven UI and Woodsmoke neutral scaling.
 */
export default function PointsDisplay({ className, showLabel = true }: PointsDisplayProps) {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true);
      const balance = await getPoints();
      setPoints(balance);
    } catch (error) {
      console.error("Failed to fetch points:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
    
    // Listen for custom event to refresh points when tasks are completed or rewards claimed
    const handleRefresh = () => fetchPoints();
    window.addEventListener("refreshPoints", handleRefresh);
    
    return () => {
      window.removeEventListener("refreshPoints", handleRefresh);
    };
  }, [fetchPoints]);

  return (
    <>
      <div 
        onClick={() => setHistoryOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 h-10 rounded-xl bg-woodsmoke-50 dark:bg-woodsmoke-800 border border-woodsmoke-200 dark:border-woodsmoke-800 transition-all cursor-pointer hover:bg-woodsmoke-100 dark:hover:bg-woodsmoke-700 active:scale-95 group",
          className
        )}
      >
        <div className="flex items-center justify-center w-5 h-5 text-brand-primary transition-transform group-hover:scale-110">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Coins className="w-4 h-4 stroke-[1.5px]" />
          )}
        </div>
        
        <div className="flex items-baseline gap-1.5">
          <motion.span 
            key={points}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold tracking-tight text-foreground"
          >
            {points !== null ? points.toLocaleString() : "---"}
          </motion.span>
          
          {showLabel && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Points
            </span>
          )}
        </div>
      </div>

      <TransactionHistoryDialog 
        open={historyOpen} 
        onOpenChange={setHistoryOpen} 
      />
    </>
  );
}
