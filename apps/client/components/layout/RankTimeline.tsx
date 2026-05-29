"use client";

import React, { useRef, useEffect } from "react";
import { CheckCircle, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { RankConfigResponse } from "@/types";
import { getRankColor } from "./rank-utils";

export function RankTimeline({ 
  ranks, 
  userXP, 
  activeRank 
}: { 
  ranks: RankConfigResponse[]; 
  userXP: number; 
  activeRank: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the active rank when the timeline opens
  useEffect(() => {
    if (scrollRef.current) {
      // Find the element with the active rank
      const activeElement = scrollRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        // Small timeout to ensure DOM layout is complete before scrolling
        setTimeout(() => {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="pt-6 border-t border-border/40 mt-4 flex flex-col w-full">
      <div 
        ref={scrollRef}
        className="relative max-h-80 overflow-y-auto overflow-x-hidden custom-scrollbar pr-3 w-full flex flex-col items-center"
      >
        <div className="relative w-full max-w-70">
          {/* Decorative continuous vertical line perfectly centered under the 24px dot (11.5px left) */}
          <div className="absolute left-[11.5px] top-4 bottom-8 w-px bg-linear-to-b from-border/80 via-border/40 to-transparent z-0 pointer-events-none" />
          
          {ranks.map((r, i) => {
          const isAchieved = userXP >= r.lifetime_xp;
          const isCurrent = r.name === activeRank;
          const color = getRankColor(r.name);
          const isGradient = color.includes('gradient');
          
          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              key={r.name} 
              data-active={isCurrent}
              className={cn("flex items-start gap-4 w-full mb-5 relative group", isAchieved ? "opacity-100" : "opacity-50 hover:opacity-100 transition-opacity")}
            >
              <div className="flex flex-col items-center z-10 pt-1">
                {isCurrent ? (
                  <div className="relative flex items-center justify-center size-6 shrink-0">
                     <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: color.includes('gradient') ? '#06B6D4' : color }} />
                     <div className="size-3.5 rounded-full ring-4 ring-background" style={{ background: color.includes('gradient') ? '#06B6D4' : color }} />
                  </div>
                ) : isAchieved ? (
                  <div className="size-6 shrink-0 rounded-full flex items-center justify-center ring-4 ring-background bg-card border border-border">
                    <CheckCircle className="size-3.5" style={{ color: color.includes('gradient') ? '#06B6D4' : color }} />
                  </div>
                ) : (
                  <div className="size-6 shrink-0 rounded-full flex items-center justify-center border-[1.5px] ring-4 ring-background bg-background" style={{ borderColor: color.includes('gradient') ? '#06B6D4' : color }}>
                    <Lock className="size-2.5 opacity-50" style={{ color: color.includes('gradient') ? '#06B6D4' : color }} />
                  </div>
                )}
              </div>
              
              <div className={cn("flex-1 p-3.5 rounded-[18px] border transition-all duration-300 backdrop-blur-md", 
                isCurrent 
                  ? "bg-card/90 border-primary/40 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] scale-[1.02]" 
                  : "bg-card/30 border-transparent hover:border-border/50 hover:bg-card/60"
              )}>
                <div className="flex justify-between items-center w-full mb-1">
                  <span 
                    className={cn("font-bold tracking-tight font-sans", isCurrent ? "text-sm" : "text-xs")}
                    style={{ 
                      color: isCurrent && !isGradient ? color : isCurrent && isGradient ? 'transparent' : 'inherit',
                      backgroundImage: isCurrent && isGradient ? color : 'none',
                      backgroundClip: isCurrent && isGradient ? 'text' : 'border-box'
                    }}
                  >
                    {r.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
                    {r.lifetime_xp.toLocaleString()} XP
                  </span>
                </div>
                
                {!isAchieved && r.perfect_weeks > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-500/90 font-bold tracking-wider uppercase bg-amber-500/10 w-fit px-2 py-1 rounded-md border border-amber-500/20">
                    <Sparkles className="size-3" />
                    Requires {r.perfect_weeks} Flawless Weeks
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
