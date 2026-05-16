"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { getAllTasks, getRewards, completeTask } from "@/lib/api";
import type { Task, Reward } from "@/types";

type TaskFilter = "all" | "active" | "completed";

/**
 * Hook for managing tasks, filtering, and completion logic.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");

  const fetchTasks = useCallback(async () => {
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
    fetchTasks();
  }, [fetchTasks]);

  const toggleComplete = async (task: Task) => {
    if (task.completed) return;
    
    const originalTasks = [...tasks];
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
      setTasks(originalTasks);
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

  return {
    tasks,
    rewards,
    filteredTasks,
    loading,
    error,
    searchQuery,
    filter,
    setSearchQuery,
    setFilter,
    toggleComplete,
    refresh: fetchTasks,
    stats
  };
}
