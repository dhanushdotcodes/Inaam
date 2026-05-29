"use client";

import React, { useEffect, useState } from "react";
import { User, LogOut, Shield, Award, Calendar, Zap, CheckCircle, ChevronDown } from "lucide-react";
import { useAppStore } from "@/hooks/store";
import { cn } from "@/lib/utils";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { getUserMe, getRanks } from "@/lib/api";
import { UserMeResponse, RankConfigResponse } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

const RANK_COLORS: Record<string, string> = {
  "Wanderer": "#6B7280",
  "Initiate": "#10B981",
  "Apprentice": "#38BDF8",
  "Spellbinder": "#8B5CF6",
  "Wizard": "#4F46E5",
  "Archmage": "#DC2626",
  "Oracle": "#F59E0B",
  "Mythic": "#06B6D4",
  "Ascendant": "#E5E7EB",
  "Chronomancer": "linear-gradient(135deg, #7C3AED, #06B6D4)",
};

function getRankColor(rankName: string) {
  const baseName = rankName.split(" ")[0];
  return RANK_COLORS[baseName] || "#6B7280";
}

export function UserSection() {
  const { isOpen } = useAppStore((state) => state.sidebar);
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [ranks, setRanks] = useState<RankConfigResponse[]>([]);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  useEffect(() => {
    getUserMe().then(setUser).catch(console.error);
    getRanks().then(setRanks).catch(console.error);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeToken();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-14 rounded-xl animate-pulse bg-muted/50 w-full" />
    );
  }

  const currentRankColor = getRankColor(user.progress?.active_rank || "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "group relative flex items-center transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] h-14 select-none outline-none rounded-xl w-full text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer overflow-hidden",
            isOpen ? "px-3 gap-3" : "px-0 gap-0 justify-center"
          )}
        >
          {/* User Icon Container */}
          <div className={cn(
            "flex items-center justify-center bg-primary/10 rounded-full text-primary shrink-0 transition-all duration-400",
            isOpen ? "size-9" : "size-10"
          )}>
            <User className="size-5 shrink-0" />
          </div>
          
          {/* Text Info */}
          <div
            className={cn(
              "flex flex-col items-start transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap overflow-hidden flex-1",
              isOpen ? "opacity-100 max-w-full translate-x-0" : "opacity-0 max-w-0 -translate-x-4 pointer-events-none"
            )}
          >
            <span className="text-sm font-bold tracking-tight text-foreground truncate w-full text-left">
              {user.username}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground truncate w-full text-left">
              {user.email}
            </span>
          </div>

          {/* Logout Button */}
          <div 
            onClick={handleLogout}
            className={cn(
              "flex items-center justify-center size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all shrink-0 z-10",
              isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-50 translate-x-4 pointer-events-none hidden"
            )}
            title="Logout"
          >
            <LogOut className="size-4" />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-background/60 backdrop-blur-2xl border-border/50 shadow-2xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-primary/10 blur-[50px] -z-10 rounded-full pointer-events-none" />
        
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-brand flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="size-5 text-primary" />
            </div>
            Adventurer Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 relative z-0 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className="flex flex-col gap-4 p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border shadow-sm backdrop-blur-md relative overflow-hidden cursor-pointer hover:bg-card/70 transition-colors"
          >
            {/* Inner rank glow */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full pointer-events-none opacity-20"
              style={{ background: currentRankColor.includes('gradient') ? '#7C3AED' : currentRankColor }}
            />
            
            <div className="flex items-center w-full relative z-10">
               <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
                    Current Rank
                    <ChevronDown className={cn("size-3 transition-transform", isTimelineOpen && "rotate-180")} />
                  </p>
                  <p 
                    className="text-xl font-brand tracking-tight flex items-center gap-2"
                    style={{ 
                      color: currentRankColor.includes('gradient') ? 'transparent' : currentRankColor,
                      backgroundImage: currentRankColor.includes('gradient') ? currentRankColor : 'none',
                      backgroundClip: currentRankColor.includes('gradient') ? 'text' : 'border-box'
                    }}
                  >
                    <Shield 
                      className="size-5" 
                      style={{ 
                        color: currentRankColor.includes('gradient') ? '#06B6D4' : currentRankColor
                      }} 
                    />
                    {user.progress?.active_rank || "Wanderer I"}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Lifetime XP</p>
                  <p className="text-2xl font-bold font-mono tracking-tighter">{user.progress?.lifetime_xp || 0}</p>
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
                  <div className="pt-4 border-t border-border/50 mt-2 flex flex-col items-start w-full">
                    {ranks.map((r, i) => {
                      const isAchieved = (user.progress?.lifetime_xp || 0) >= r.lifetime_xp;
                      const isCurrent = r.name === user.progress?.active_rank;
                      const color = getRankColor(r.name);
                      const isGradient = color.includes('gradient');
                      
                      return (
                        <div key={r.name} className={cn("flex items-stretch gap-4 w-full", isAchieved ? "opacity-100" : "opacity-30")}>
                          <div className="flex flex-col items-center">
                            <div 
                              className={cn("w-3 h-3 rounded-full mt-1 shrink-0", isCurrent && "ring-4 ring-primary/20 scale-125")} 
                              style={{ background: color }} 
                            />
                            {i !== ranks.length - 1 && <div className="w-0.5 h-full min-h-[2rem] bg-border my-1" />}
                          </div>
                          <div className={cn("flex-1 pb-4", i === ranks.length - 1 && "pb-0")}>
                            <div className="flex justify-between items-center w-full">
                              <span 
                                className={cn("font-bold tracking-tight text-sm", isCurrent && "text-lg font-brand")}
                                style={{ 
                                  color: isCurrent && !isGradient ? color : isCurrent && isGradient ? 'transparent' : 'inherit',
                                  backgroundImage: isCurrent && isGradient ? color : 'none',
                                  backgroundClip: isCurrent && isGradient ? 'text' : 'border-box'
                                }}
                              >
                                {r.name}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">{r.lifetime_xp} XP</span>
                            </div>
                            {!isAchieved && r.perfect_weeks > 0 && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">Requires {r.perfect_weeks} Perfect Weeks</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center p-5 bg-card/40 hover:bg-card/80 transition-colors rounded-2xl border border-border/50 backdrop-blur-md"
            >
              <Award className="size-7 text-yellow-500 mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              <p className="text-3xl font-bold font-mono tracking-tighter">{user.progress?.spendable_points || 0}</p>
              <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mt-1">Points</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center justify-center p-5 bg-card/40 hover:bg-card/80 transition-colors rounded-2xl border border-border/50 backdrop-blur-md"
            >
              <CheckCircle className="size-7 text-emerald-500 mb-3 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <p className="text-3xl font-bold font-mono tracking-tighter">{user.progress?.total_tasks_completed || 0}</p>
              <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mt-1">Tasks Done</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center p-5 bg-card/40 hover:bg-card/80 transition-colors rounded-2xl border border-border/50 backdrop-blur-md"
            >
              <Calendar className="size-7 text-purple-500 mb-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
              <p className="text-3xl font-bold font-mono tracking-tighter">{user.progress?.perfect_weeks || 0}</p>
              <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mt-1">Perfect Weeks</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col items-center justify-center p-5 bg-card/40 hover:bg-card/80 transition-colors rounded-2xl border border-border/50 backdrop-blur-md"
            >
              <Zap className="size-7 text-orange-500 mb-3 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
              <p className="text-3xl font-bold font-mono tracking-tighter">{user.progress?.current_streak || 0}</p>
              <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mt-1">Day Streak</p>
            </motion.div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
