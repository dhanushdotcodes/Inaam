"use client";

import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { getAllTasks, completeTask, incompleteTask, deleteTask, updateTask } from "@/lib/api";
import type { Task } from "@/types";
import { TaskDifficulty } from "@/types";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";

type TaskFilter = "active" | "completed";

/**
 * Hook for managing tasks, filtering, and completion logic.
 */
export function useTasks() {
  const addToast = useToast((s) => s.addToast);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filter, setFilter] = useState<TaskFilter>("active");
  const [difficultyFilter, setDifficultyFilter] = useState<TaskDifficulty>(TaskDifficulty.ALL);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const LIMIT = 20;

  const fetchTasks = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
      }
      setError(null);
      
      const tasksData = await getAllTasks({ 
        limit: LIMIT, 
        offset: offsetRef.current, 
        status: filter, 
        search: debouncedSearchQuery 
      });
      
      setTasks(prev => {
        if (reset) return tasksData || [];
        const existingIds = new Set(prev.map(t => t.id));
        const newTasks = (tasksData || []).filter(t => !existingIds.has(t.id));
        return [...prev, ...newTasks];
      });
      
      if ((tasksData || []).length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      offsetRef.current += (tasksData || []).length;
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      if (reset) setLoading(false);
    }
  }, [debouncedSearchQuery, filter]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchTasks(true);
      }
    });
    return () => {
      active = false;
    };
  }, [fetchTasks]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchTasks(false);
  }, [hasMore, loading, fetchTasks]);

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
        await completeTask(task.id);
        
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
        await incompleteTask(task.id);
        
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

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
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

      await updateTask(task.id, { pinned: isPinning });

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
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = 
        difficultyFilter === TaskDifficulty.ALL || 
        task.difficulty === difficultyFilter;
        
      return matchesSearch && matchesDifficulty;
    });
  }, [tasks, searchQuery, difficultyFilter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    searchQuery,
    filter,
    difficultyFilter,
    hasMore,
    setSearchQuery,
    setFilter,
    setDifficultyFilter,
    toggleComplete,
    deleteTask: removeTask,
    pinTask,
    loadMore,
    refresh: () => fetchTasks(true),
    stats
  };
}
