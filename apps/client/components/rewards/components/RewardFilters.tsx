"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

interface RewardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: "all" | "active" | "claimed";
  onFilterChange: (filter: "all" | "active" | "claimed") => void;
  placeholder?: string;
  layoutIdPrefix?: string;
}

export default function RewardFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  placeholder = "Search rewards...",
  layoutIdPrefix = "reward"
}: RewardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
      {/* Search Input Container */}
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
        <Input 
          placeholder={placeholder}
          className="pl-12 bg-card border-border hover:border-muted-foreground/30 focus-visible:border-primary transition-all duration-300 shadow-sm rounded-2xl"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Tabs Container */}
      <div className="flex items-center gap-1 p-1.5 h-12 rounded-2xl bg-muted/40 border border-border backdrop-blur-sm shrink-0 w-full sm:w-auto">
        {(["all", "active", "claimed"] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={cn(
                "relative flex-1 sm:flex-none px-4 h-9 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors outline-none select-none cursor-pointer flex items-center justify-center min-w-24",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`${layoutIdPrefix}FilterPill`}
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
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
