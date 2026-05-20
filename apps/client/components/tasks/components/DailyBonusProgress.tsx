"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Sparkles, Trophy, CheckCircle2, Lock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getTransactions } from "@/lib/api";
import type { PointTransaction } from "@/types";
import { TransactionType } from "@/types";
import { cn } from "@/lib/utils";

interface Milestone {
  threshold: number;
  bonus: number;
  label: string;
  emoji: string;
}

const MILESTONES: Milestone[] = [
  { threshold: 2000, bonus: 300, label: "2K", emoji: "🎉" },
  { threshold: 3000, bonus: 500, label: "3K", emoji: "🚀" },
  { threshold: 4000, bonus: 1000, label: "4K", emoji: "🔥" },
  { threshold: 5000, bonus: 2000, label: "5K", emoji: "👑" },
];

export default function DailyBonusProgress() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions for daily progress:", err);
      setError("Failed to load daily progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodayData();

    // Listen for custom event to refresh when tasks are completed
    const handleRefresh = () => {
      fetchTodayData();
    };
    window.addEventListener("refreshPoints", handleRefresh);

    return () => {
      window.removeEventListener("refreshPoints", handleRefresh);
    };
  }, []);

  // Filter transactions for today in user's local timezone calendar day
  const todayStats = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;

    const todayTxs = transactions.filter((tx) => {
      const txTime = new Date(tx.created_at).getTime();
      return txTime >= todayStart && txTime <= todayEnd;
    });

    // 1. Earned points today from completed tasks
    const earned = todayTxs
      .filter((tx) => tx.type === TransactionType.EARNED)
      .reduce((sum, tx) => sum + tx.points, 0);

    // 2. Bonus point descriptions unlocked today
    const bonuses = todayTxs
      .filter((tx) => tx.type === TransactionType.BONUS && tx.description.includes("Daily Milestone"))
      .map((tx) => tx.description);

    return { earned, bonuses };
  }, [transactions]);

  const earnedToday = todayStats.earned;

  const maxThreshold = MILESTONES[MILESTONES.length - 1].threshold;
  
  // Premium progress bar calculation
  const progressPercent = useMemo(() => {
    return Math.min((earnedToday / maxThreshold) * 100, 100);
  }, [earnedToday, maxThreshold]);

  const reachedCount = useMemo(() => {
    return MILESTONES.filter((m) => earnedToday >= m.threshold).length;
  }, [earnedToday]);

  if (loading && transactions.length === 0) return null;
  if (error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="w-full relative overflow-hidden p-6 rounded-[28px] bg-card border border-border shadow-sm group hover:border-border/80 transition-all duration-300"
    >
      {/* Ambient background glow matching premium aesthetic */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-105 duration-700" />
      
      <div className="relative flex flex-col gap-5 w-full">
        {/* Header section with status, total daily points, and next milestone details */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 flex items-center gap-1.5 leading-none">
              <Sparkles className="size-3 text-brand-blue animate-pulse" />
              Daily Milestone Progress
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold tracking-tight text-foreground leading-none">
                {earnedToday.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Pts Earned Today
              </span>
            </div>
          </div>
        </div>

        {/* Premium Progress Bar Wrapper with Milestone Dots */}
        <div className="relative w-full py-4 mt-1">
          {/* Track and Progress Bar */}
          <div className="h-2.5 w-full bg-muted dark:bg-neutral-800/80 rounded-full overflow-hidden border border-border/40 relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="h-full bg-linear-to-r from-brand-blue/80 via-brand-blue to-emerald-500 dark:to-emerald-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            />
          </div>

          {/* Milestone Indicator Node Marks along the bar */}
          <div className="absolute top-1/2 left-0 right-0 w-full -translate-y-1/2 flex justify-between pointer-events-none px-1">
            {MILESTONES.map((m) => {
              const isReached = earnedToday >= m.threshold;
              const pct = (m.threshold / maxThreshold) * 100;
              const isLast = m.threshold === maxThreshold;
              
              return (
                <div 
                  key={m.threshold} 
                  style={{ left: `calc(${pct}% - 12px)` }}
                  className="absolute flex items-center justify-center size-6 pointer-events-auto cursor-help"
                  onMouseEnter={() => setHoveredMilestone(m.threshold)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                >
                  {/* Tooltip (Desktop Only) */}
                  <AnimatePresence>
                    {hoveredMilestone === m.threshold && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95, x: isLast ? 0 : "-50%" }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: isLast ? 0 : "-50%" }}
                        exit={{ opacity: 0, y: 8, scale: 0.95, x: isLast ? 0 : "-50%" }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                          "absolute bottom-full mb-2.5 z-30 hidden md:block pointer-events-none",
                          isLast ? "right-0" : "left-1/2"
                        )}
                      >
                        <div className="relative bg-card/98 dark:bg-zinc-950/98 border border-border shadow-lg px-3.5 py-2.5 rounded-xl flex flex-col gap-0.5 w-36 text-center backdrop-blur-xs">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                            <span>{m.label} Milestone</span>
                            <span className="text-xs">{m.emoji}</span>
                          </div>
                          <div className="text-sm font-extrabold text-foreground mt-0.5">
                            +{m.bonus} Pts
                          </div>
                          <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase mt-1">
                            {isReached ? (
                              <span className="text-emerald-500 flex items-center gap-0.5">
                                <CheckCircle2 className="size-2.5 stroke-[2.5px]" /> Reached
                              </span>
                            ) : (
                              <span className="text-muted-foreground/80 flex items-center gap-0.5">
                                <Lock className="size-2.5" /> Locked
                              </span>
                            )}
                          </div>
                          {/* Tooltip Arrow */}
                          <div 
                            className={cn(
                              "absolute -bottom-1 size-2 rotate-45 bg-card dark:bg-zinc-950 border-r border-b border-border",
                              isLast ? "right-2" : "left-1/2 -translate-x-1/2"
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Node Circle */}
                  <div 
                    className={cn(
                      "size-4 rounded-full border flex items-center justify-center shadow-xs transition-all duration-500 scale-100",
                      isReached 
                        ? "bg-emerald-500 border-emerald-400 text-white scale-110 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                        : "bg-background border-border text-muted-foreground"
                    )}
                  >
                    {isReached ? (
                      <CheckCircle2 className="size-2.5 stroke-[3px]" />
                    ) : (
                      <div className="size-1 bg-muted-foreground/60 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown Button & Collapsible Cards */}
        <div className="w-full flex flex-col md:hidden">
          <button
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/60 border border-border/50 text-foreground transition-all duration-200 mt-2"
          >
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-brand-blue" />
              <span className="text-xs font-bold uppercase tracking-wider">Milestone Rewards</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span>{reachedCount} of {MILESTONES.length} Unlocked</span>
              <ChevronDown className={cn("size-4 transition-transform duration-300", mobileDropdownOpen && "rotate-180")} />
            </div>
          </button>

          <AnimatePresence>
            {mobileDropdownOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden w-full"
              >
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {MILESTONES.map((m) => {
                    const isReached = earnedToday >= m.threshold;
                    
                    return (
                      <div
                        key={m.threshold}
                        className={cn(
                          "relative flex flex-col p-3 rounded-2xl border transition-all duration-300",
                          isReached
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 dark:bg-emerald-500/10"
                            : "bg-muted/10 border-border/40 text-muted-foreground opacity-60 hover:opacity-85"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-black tracking-wider uppercase leading-none">
                            {m.label} Milestone
                          </span>
                          <span className="text-sm select-none leading-none">
                            {m.emoji}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-2.5 leading-none">
                          <span className="text-base font-extrabold text-foreground">
                            +{m.bonus}
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            Pts
                          </span>
                        </div>
                        
                        {/* Visual Status Indicator at bottom of milestone card */}
                        <div className="flex items-center gap-1.5 mt-3 text-[9px] font-bold uppercase tracking-wider">
                          {isReached ? (
                            <span className="flex items-center gap-1 text-emerald-500">
                              <CheckCircle2 className="size-3 stroke-[2px]" /> Reached
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground/80">
                              <Lock className="size-3" /> Locked
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
