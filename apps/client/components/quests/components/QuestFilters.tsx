"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input 
          placeholder="Search quests..." 
          className="pl-10 h-10 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-zinc-900 shadow-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
              filter === f 
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50" 
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
