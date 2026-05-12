"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { getAllTasks, getRewards, updateTask } from "@/lib/api";
import type { Task, Reward } from "@/types";
import { Button } from "@/components/ui/button";
import QuestHeader from "./components/QuestHeader";
import QuestFilters from "./components/QuestFilters";
import QuestList from "./components/QuestList";

/**
 * QuestDashboard component — Orchestrates the display and completion of all tasks.
 */
export default function QuestDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const fetchQuestsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, rewardsData] = await Promise.all([
        getAllTasks(),
        getRewards()
      ]);
      setTasks(tasksData || []);
      setRewards(rewardsData || []);
    } catch (err) {
      console.error("Fetch quests error:", err);
      setError(err instanceof Error ? err.message : "Failed to load quests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestsData();
  }, [fetchQuestsData]);

  const handleToggleComplete = async (task: Task) => {
    const newStatus = !task.completed;
    try {
      // Optimistic update
      setTasks((prev) => 
        prev.map((t) => t.id === task.id ? { ...t, completed: newStatus } : t)
      );

      await updateTask(task.reward_id, task.id, { completed: newStatus });
    } catch (err) {
      console.error("Toggle quest error:", err);
      // Revert optimistic update
      setTasks((prev) => 
        prev.map((t) => t.id === task.id ? { ...t, completed: !newStatus } : t)
      );
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === "all" || 
        (filter === "active" && !task.completed) || 
        (filter === "completed" && task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300 mb-4" />
        <p className="text-sm text-zinc-500">Loading your journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={fetchQuestsData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-8">
      <QuestHeader 
        completedCount={stats.completed} 
        totalCount={stats.total} 
      />

      <div className="px-8 space-y-6">
        <QuestFilters 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          filter={filter} 
          onFilterChange={setFilter} 
        />

        <QuestList 
          tasks={filteredTasks} 
          rewards={rewards} 
          onToggle={handleToggleComplete} 
        />
      </div>
    </div>
  );
}
