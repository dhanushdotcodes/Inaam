"use client";

import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { getRewards, getRewardTasks } from "@/lib/api";
import type { RewardWithTasks } from "@/types";
import { RewardType } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

type RewardFilter = "all" | "active" | "claimed";

/**
 * Hook for fetching and managing rewards by type.
 */
export function useRewards(type: RewardType) {
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<RewardFilter>("active");
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const LIMIT = 20;

  const fetchRewards = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
      }
      setError(null);
      
      let apiStatus: "claimed" | "unclaimed" | undefined;
      if (statusFilter === "active") apiStatus = "unclaimed";
      if (statusFilter === "claimed") apiStatus = "claimed";

      const data = await getRewards({
        limit: LIMIT,
        offset: offsetRef.current,
        status: apiStatus,
        search: debouncedSearchQuery,
        reward_type: type
      });

      if (!Array.isArray(data)) {
        if (reset) setRewards([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      const newRewards: RewardWithTasks[] = data.map((r) => ({
        ...r,
        tasks: [],
        tasksLoading: true,
      }));

      setRewards(prev => {
        if (reset) return newRewards;
        const existingIds = new Set(prev.map(r => r.id));
        const filtered = newRewards.filter(r => !existingIds.has(r.id));
        return [...prev, ...filtered];
      });

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      offsetRef.current += data.length;
      
      // Fetch tasks for the newly fetched rewards
      const taskResults = await Promise.allSettled(
        data.map((r) => getRewardTasks(r.id))
      );

      setRewards((prev) =>
        prev.map((reward) => {
          const index = data.findIndex(d => d.id === reward.id);
          if (index === -1) return reward; // Already had tasks fetched
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
    } finally {
      if (reset) setLoading(false);
    }
  }, [type, debouncedSearchQuery, statusFilter]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchRewards(true);
      }
    });
    return () => {
      active = false;
    };
  }, [fetchRewards]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchRewards(false);
  }, [hasMore, loading, fetchRewards]);

  const updateReward = (updatedReward: RewardWithTasks) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === updatedReward.id ? updatedReward : r))
    );
  };

  const filteredRewards = useMemo(() => {
    return rewards.filter((r) => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rewards, searchQuery]);

  return {
    rewards,
    filteredRewards,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hasMore,
    loadMore,
    refresh: () => fetchRewards(true),
    updateReward,
    setRewards
  };
}
