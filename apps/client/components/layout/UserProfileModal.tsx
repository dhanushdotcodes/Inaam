"use client";

import React, { useMemo, useState } from "react";
import { LogOut, Shield, ChevronDown, Flame, Swords, Coins, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMeResponse, RankConfigResponse } from "@/types";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { getRankColor } from "./rank-utils";
import { RankTimeline } from "./RankTimeline";
import { StatRow } from "./StatRow";
import { UserSidebarTrigger } from "./UserSidebarTrigger";

export function UserProfileModal({ 
  user, 
  ranks, 
  isSidebarOpen, 
  onLogout 
}: { 
  user: UserMeResponse; 
  ranks: RankConfigResponse[]; 
  isSidebarOpen: boolean; 
  onLogout: (e: React.MouseEvent) => void;
}) {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const currentRankColor = getRankColor(user.progress?.active_rank || "");

  // Calculate Progress to Next Rank
  const { currentXP, nextRankXP, progressPercent } = useMemo(() => {
    const xp = user.progress?.lifetime_xp || 0;
    if (!ranks.length) return { currentXP: xp, nextRankXP: xp, progressPercent: 100 };
    
    const currentIndex = ranks.findIndex(r => r.name === user.progress?.active_rank);
    if (currentIndex === -1 || currentIndex === ranks.length - 1) {
      return { currentXP: xp, nextRankXP: xp, progressPercent: 100 };
    }
    
    const nextRank = ranks[currentIndex + 1];
    const prevRank = ranks[currentIndex];
    
    const xpInLevel = xp - prevRank.lifetime_xp;
    const xpNeededForLevel = nextRank.lifetime_xp - prevRank.lifetime_xp;
    const pct = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));
    
    return { 
      currentXP: xp, 
      nextRankXP: nextRank.lifetime_xp, 
      progressPercent: pct 
    };
  }, [ranks, user.progress]);

  return (
    <>
      <UserSidebarTrigger 
        user={{ username: user.username, email: user.email }} 
        isSidebarOpen={isSidebarOpen} 
        onLogout={onLogout} 
      />

      <DialogContent className="sm:max-w-md bg-background/60 backdrop-blur-2xl border-border/50 shadow-[0_16px_40px_rgba(0,0,0,0.18)] rounded-[24px] overflow-hidden max-h-[90vh] flex flex-col font-sans p-0! gap-0!">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-primary/10 blur-[50px] -z-10 rounded-full pointer-events-none" />
        
        <DialogHeader className="shrink-0 flex flex-row items-center gap-4 space-y-0 p-6 pb-5 border-b border-border/40 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
            <div className="size-14 rounded-full bg-linear-to-b from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30 shrink-0 shadow-inner relative z-10">
              <Shield className="size-7 text-primary drop-shadow-md" />
            </div>
          </div>
          <div className="flex flex-col items-start flex-1 overflow-hidden pt-1">
            <DialogTitle className="text-2xl font-bold tracking-tight truncate w-full text-left font-sans text-foreground">
              {user.username}
            </DialogTitle>
            <p className="text-[11px] text-muted-foreground truncate w-full text-left mt-0.5 font-semibold tracking-widest uppercase opacity-80 font-sans">
              {user.email}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-6 pt-5 relative z-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Main Rank Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className="group flex flex-col gap-4 p-6 rounded-[24px] bg-linear-to-br from-card/80 to-card/30 border border-border/60 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl relative overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            
            <div 
              className="absolute -top-12 -right-12 w-40 h-40 blur-[50px] rounded-full pointer-events-none opacity-30 transition-opacity group-hover:opacity-50"
              style={{ background: currentRankColor.includes('gradient') ? '#7C3AED' : currentRankColor }}
            />
            
            <div className="flex items-center w-full relative z-10">
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Current Rank
                    </p>
                    {/* Clear UI indicator that this is clickable */}
                    <div className="flex items-center text-[10px] text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Timeline <ChevronDown className={cn("size-3 ml-1 transition-transform duration-500", isTimelineOpen && "rotate-180")} />
                    </div>
                  </div>
                  
                  <p 
                    className="text-2xl font-bold uppercase tracking-wider flex items-center gap-2 mt-1 font-sans"
                    style={{ 
                      color: currentRankColor.includes('gradient') ? 'transparent' : currentRankColor,
                      backgroundImage: currentRankColor.includes('gradient') ? currentRankColor : 'none',
                      backgroundClip: currentRankColor.includes('gradient') ? 'text' : 'border-box'
                    }}
                  >
                    <Shield 
                      className="size-6 drop-shadow-sm" 
                      style={{ color: currentRankColor.includes('gradient') ? '#06B6D4' : currentRankColor }} 
                    />
                    {user.progress?.active_rank || "Wanderer I"}
                  </p>
                  
                  {nextRankXP > currentXP && (
                    <div className="mt-4 w-full max-w-55">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 font-semibold tracking-wider">
                        <span className="tabular-nums">{currentXP.toLocaleString()} XP</span>
                        <span className="tabular-nums">{nextRankXP.toLocaleString()} XP</span>
                      </div>
                      <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full relative overflow-hidden"
                          style={{ background: currentRankColor.includes('gradient') ? currentRankColor : currentRankColor }}
                        >
                          {/* Animated inner gloss */}
                          <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 animate-[shimmer_2s_infinite]" />
                        </motion.div>
                      </div>
                    </div>
                  )}
               </div>
               <div className="text-right flex flex-col items-end justify-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Lifetime XP</p>
                  <p className="text-3xl font-bold tracking-tighter font-sans tabular-nums bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {currentXP.toLocaleString()}
                  </p>
               </div>
            </div>

            <AnimatePresence>
              {isTimelineOpen && ranks.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden relative z-10 w-full"
                >
                  <RankTimeline 
                    ranks={ranks} 
                    userXP={currentXP} 
                    activeRank={user.progress?.active_rank || ""} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* iOS-Style Grouped List for Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col bg-card/30 border border-border/50 rounded-[24px] overflow-hidden backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] relative"
          >
            <StatRow 
              icon={Coins}
              label="Points Balance"
              value={user.progress?.spendable_points?.toLocaleString() || 0}
              theme="yellow"
            />
            <StatRow 
              icon={Swords}
              label="Bounties Completed"
              value={user.progress?.total_tasks_completed?.toLocaleString() || 0}
              theme="emerald"
            />
            <StatRow 
              icon={Sparkles}
              label="Flawless Weeks"
              value={user.progress?.perfect_weeks?.toLocaleString() || 0}
              theme="purple"
            />
            <StatRow 
              icon={Flame}
              label="Day Streak"
              value={
                <>
                  {user.progress?.current_streak || 0}
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Days</span>
                </>
              }
              theme="orange"
            />
          </motion.div>

        </div>
      </DialogContent>
    </>
  );
}
