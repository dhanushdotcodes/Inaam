"use client";

import { useCallback, useEffect, useState } from "react";
import { getRewards, getRewardTasks } from "@/lib/api";
import type { RewardWithTasks } from "@/types";
import { RewardType } from "@/types";

/**
 * Hook for fetching and managing rewards by type.
 */
export function useRewards(type: RewardType) {
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRewards();

      if (!Array.isArray(data)) {
        setRewards([]);
        setLoading(false);
        return;
      }

      // Filter by type
      const filteredData = data.filter(r => r.reward_type === type);

      if (filteredData.length === 0) {
        setRewards([]);
        setLoading(false);
        return;
      }

      const initialRewards: RewardWithTasks[] = filteredData.map((r) => ({
        ...r,
        tasks: [],
        tasksLoading: true,
      }));
      setRewards(initialRewards);
      setLoading(false);

      // Fetch tasks for each reward
      const taskResults = await Promise.allSettled(
        filteredData.map((r) => getRewardTasks(r.id))
      );

      setRewards((prev) =>
        prev.map((reward, index) => {
          const result = taskResults[index];
          return {
            ...reward,
            tasks: result.status === "fulfilled" ? result.value : [],
            tasksLoading: false,
          };
        })
      );
    } catch (err) {
      console.error(`Fetch ${type} error:`, err);
      setError(err instanceof Error ? err.message : `Failed to fetch ${type}s`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const updateReward = (updatedReward: RewardWithTasks) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === updatedReward.id ? updatedReward : r))
    );
  };

  return {
    rewards,
    loading,
    error,
    refresh: fetchRewards,
    updateReward,
    setRewards
  };
}
