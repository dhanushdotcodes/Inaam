"use client";

import React, { useMemo, useState } from "react";
import { Shield, ChevronDown, Flame, Swords, Coins, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMeResponse, RankConfigResponse } from "@/types";
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
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
  const { currentXP } = useMemo(() => {
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

      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl rounded-[24px] overflow-hidden max-h-[90vh] flex flex-col font-sans p-0! gap-0! [&>button]:hidden">
        
        <DialogHeader className="shrink-0 flex flex-row items-center gap-4 space-y-0 p-6 pb-6 relative z-10">
          <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shrink-0 relative z-10">
            <Shield className="size-7 text-primary" />
          </div>
          <div className="flex flex-col items-start flex-1 overflow-hidden">
            <DialogTitle className="text-2xl font-bold tracking-tight truncate w-full text-left font-sans text-foreground">
              {user.username}
            </DialogTitle>
            <p className="text-[11px] text-muted-foreground truncate w-full text-left font-semibold tracking-widest uppercase mt-0.5">
              {user.email}
            </p>
          </div>
          <DialogClose className="absolute right-6 top-6 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-foreground">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 p-6 pt-0 relative z-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Main Rank Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className="group flex flex-col p-6 pb-4 rounded-[24px] bg-card border border-border relative overflow-hidden cursor-pointer hover:border-primary/40 transition-colors duration-300 shadow-sm"
          >
            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-16 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10 w-full">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Current Rank
                    </p>
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
               </div>
               
               <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Lifetime XP</p>
                  <p className="text-3xl font-bold tracking-tighter tabular-nums text-foreground">
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
                  className="overflow-hidden relative z-10 w-full mt-4"
                >
                  <RankTimeline 
                    ranks={ranks} 
                    userXP={currentXP} 
                    activeRank={user.progress?.active_rank || ""} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full flex justify-center mt-5 relative z-10">
              <ChevronDown className={cn("size-5 text-muted-foreground transition-transform duration-300", isTimelineOpen && "rotate-180")} />
            </div>
          </motion.div>

          {/* Stats Grouped List */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="flex flex-col bg-card border border-border rounded-[24px] overflow-hidden shadow-sm"
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
                <div className="flex items-baseline gap-1">
                  <span>{user.progress?.current_streak || 0}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Days</span>
                </div>
              }
              theme="orange"
            />
          </motion.div>

        </div>
      </DialogContent>
    </>
  );
}
