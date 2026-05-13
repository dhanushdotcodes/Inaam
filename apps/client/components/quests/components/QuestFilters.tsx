"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

interface QuestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

export default function QuestFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: QuestFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input 
          placeholder="Search quests..." 
          className="pl-12"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-muted/40 border border-border backdrop-blur-sm shrink-0">
        {(["all", "active", "completed"] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={cn(
                "relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors outline-none select-none",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
