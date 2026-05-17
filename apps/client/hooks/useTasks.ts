"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { getAllTasks, getRewards, completeTask, deleteTask } from "@/lib/api";
import type { Task, Reward } from "@/types";
import { TaskDifficulty } from "@/types";

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
  const [difficultyFilter, setDifficultyFilter] = useState<TaskDifficulty | "all">("all");

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

  const removeTask = async (taskId: string, rewardId?: string | null) => {
    try {
      await deleteTask(taskId, rewardId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      
      // Dispatch refreshPoints event
      window.dispatchEvent(new CustomEvent("refreshPoints"));
    } catch (err) {
      console.error("Delete task error:", err);
      throw err;
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Find associated quest (reward) title
      const associatedReward = task.reward_id 
        ? rewards.find((r) => r.id === task.reward_id)
        : null;
      const questTitle = associatedReward ? associatedReward.title : "";

      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        questTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        filter === "all" || 
        (filter === "active" && !task.completed) || 
        (filter === "completed" && task.completed);
      const matchesDifficulty = 
        difficultyFilter === "all" || 
        task.difficulty === difficultyFilter;
      return matchesSearch && matchesFilter && matchesDifficulty;
    });
  }, [tasks, rewards, searchQuery, filter, difficultyFilter]);

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
    difficultyFilter,
    setSearchQuery,
    setFilter,
    setDifficultyFilter,
    toggleComplete,
    deleteTask: removeTask,
    refresh: fetchTasks,
    stats
  };
}
