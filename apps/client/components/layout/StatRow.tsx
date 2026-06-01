import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTheme = 'yellow' | 'emerald' | 'purple' | 'orange';

const THEME_CLASSES: Record<StatTheme, { bgHover: string, iconBg: string, iconColor: string }> = {
  yellow: {
    bgHover: "bg-yellow-500/5",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500"
  },
  emerald: {
    bgHover: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500"
  },
  purple: {
    bgHover: "bg-purple-500/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500"
  },
  orange: {
    bgHover: "bg-orange-500/5",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500"
  }
};

interface StatRowProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  theme: StatTheme;
}

export function StatRow({ icon: Icon, label, value, theme }: StatRowProps) {
  const classes = THEME_CLASSES[theme];

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 h-[64px] sm:h-[72px] hover:bg-secondary/50 transition-colors border-b border-border group relative overflow-hidden last:border-b-0">
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", classes.bgHover)} />
      <div className="flex items-center gap-3 sm:gap-4 relative z-10">
        <div className={cn("size-8 sm:size-10 rounded-full flex items-center justify-center shrink-0", classes.iconBg)}>
          <Icon className={cn("size-4 sm:size-5", classes.iconColor)} />
        </div>
        <p className="text-xs sm:text-sm font-bold text-foreground tracking-tight">{label}</p>
      </div>
      <div className="text-lg sm:text-xl font-bold tracking-tighter tabular-nums relative z-10 flex items-center gap-1 sm:gap-1.5 text-foreground">
        {value}
      </div>
    </div>
  );
}
