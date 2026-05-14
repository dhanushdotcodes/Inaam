"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskHeader from "./components/TaskHeader";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import TaskCreateDialog from "./components/BountyCreateDialog";
import { getAllTasks, getRewards, completeTask } from "@/lib/api";
import type { Task, Reward } from "@/types";
import UnclaimedPoints from "@/components/tasks/components/UnclaimedPoints";

/**
 * TaskDashboard component — Orchestrates the display and completion of all tasks (Bounties & Objectives).
 */
export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchTasksData = useCallback(async () => {
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
      console.error("Fetch tasks error:", err);
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  const handleToggleComplete = async (task: Task) => {
    if (task.completed) return;
    
    try {
      // Optimistic update
      setTasks((prev) => 
        prev.map((t) => t.id === task.id ? { ...t, completed: true, completed_at: new Date().toISOString() } : t)
      );

      await completeTask(task.id, task.reward_id);
      // Dispatch refreshPoints event
      window.dispatchEvent(new CustomEvent("refreshPoints"));
    } catch (err) {
      console.error("Toggle task error:", err);
      // Revert optimistic update
      setTasks((prev) => 
        prev.map((t) => t.id === task.id ? { ...t, completed: false, completed_at: null } : t)
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
        <p className="text-sm text-zinc-500">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={fetchTasksData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-8">
      <TaskHeader 
        completedCount={stats.completed} 
        totalCount={stats.total} 
        onNewTask={() => setIsCreateDialogOpen(true)}
      />

      <div className="px-8 space-y-6">
        <TaskFilters 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          filter={filter} 
          onFilterChange={setFilter} 
        />

        <UnclaimedPoints tasks={tasks} />

        <TaskList 
          tasks={filteredTasks} 
          rewards={rewards} 
          onToggle={handleToggleComplete} 
        />
      </div>

      <TaskCreateDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={fetchTasksData}
      />
    </div>
  );
}
