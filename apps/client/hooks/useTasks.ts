"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { getAllTasks, getRewards, completeTask, incompleteTask, deleteTask, updateTask } from "@/lib/api";
import type { Task, Reward } from "@/types";
import { TaskDifficulty } from "@/types";
import { useToast } from "@/hooks/useToast";

type TaskFilter = "all" | "active" | "completed";

/**
 * Hook for managing tasks, filtering, and completion logic.
 */
export function useTasks() {
  const addToast = useToast((s) => s.addToast);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  const toggleComplete = async (task: Task) => {
    const isCompleting = !task.completed;
    const originalTasks = [...tasks];
    
    try {
      // Optimistic update
      setTasks((prev) => 
        prev.map((t) => t.id === task.id ? { 
          ...t, 
          completed: isCompleting, 
          completed_at: isCompleting ? new Date().toISOString() : null 
        } : t)
      );

      if (isCompleting) {
        await completeTask(task.id, task.reward_id);
        
        // Dispatch refreshPoints event
        window.dispatchEvent(new CustomEvent("refreshPoints"));

        // Add success toast with Undo capability
        addToast({
          message: `Task completed!`,
          type: "success",
          points: task.points,
          action: {
            label: "Undo",
            onClick: async () => {
              await toggleComplete({ ...task, completed: true });
            }
          }
        });
      } else {
        await incompleteTask(task.id, task.reward_id);
        
        // Dispatch refreshPoints event
        window.dispatchEvent(new CustomEvent("refreshPoints"));

        // Add warning / reverted toast
        addToast({
          message: `Task reverted to active.`,
          type: "warning",
        });
      }
    } catch (err) {
      console.error("Toggle task error:", err);
      // Revert optimistic update
      setTasks(originalTasks);
      
      addToast({
        message: `Failed to update task: ${err instanceof Error ? err.message : "unknown error"}`,
        type: "error"
      });
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

  const pinTask = async (task: Task) => {
    const isPinning = !task.pinned;
    
    if (isPinning) {
      const activePinnedCount = tasks.filter((t) => t.pinned && !t.completed).length;
      if (activePinnedCount >= 3) {
        addToast({
          message: "You can only pin up to 3 tasks.",
          type: "error"
        });
        return;
      }
    }

    const originalTasks = [...tasks];

    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, pinned: isPinning } : t))
      );

      await updateTask(task.id, { pinned: isPinning }, task.reward_id);

      addToast({
        message: isPinning ? "Task pinned to dashboard." : "Task unpinned.",
        type: "success"
      });
    } catch (err) {
      console.error("Pin task error:", err);
      // Revert optimistic update
      setTasks(originalTasks);
      addToast({
        message: `Failed to update task: ${err instanceof Error ? err.message : "unknown error"}`,
        type: "error"
      });
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
    pinTask,
    refresh: fetchTasks,
    stats
  };
}
