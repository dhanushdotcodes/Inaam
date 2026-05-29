import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTheme = 'yellow' | 'emerald' | 'purple' | 'orange';

const THEME_CLASSES: Record<StatTheme, { bgHover: string, iconBg: string, iconColor: string }> = {
  yellow: {
    bgHover: "bg-yellow-500/5",
    iconBg: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
    iconColor: "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
  },
  emerald: {
    bgHover: "bg-emerald-500/5",
    iconBg: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    iconColor: "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
  },
  purple: {
    bgHover: "bg-purple-500/5",
    iconBg: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
    iconColor: "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
  },
  orange: {
    bgHover: "bg-orange-500/5",
    iconBg: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
    iconColor: "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
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
    <div className="flex items-center justify-between p-4 px-5 hover:bg-card/60 transition-colors border-b border-border/40 group relative overflow-hidden last:border-b-0">
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", classes.bgHover)} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn("size-11 rounded-2xl bg-linear-to-br flex items-center justify-center shrink-0 border shadow-inner", classes.iconBg)}>
          <Icon className={cn("size-5", classes.iconColor)} />
        </div>
        <p className="text-sm font-bold text-foreground tracking-tight font-sans">{label}</p>
      </div>
      <div className="text-xl font-bold tracking-tighter font-sans tabular-nums relative z-10 flex items-center gap-1.5">
        {value}
      </div>
    </div>
  );
}
