"use client";

import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { getRewards } from "@/lib/api";
import type { Reward } from "@/types";

import { useDebounce } from "@/hooks/useDebounce";

type RewardFilter = "active" | "claimed";

/**
 * Hook for fetching and managing rewards.
 */
export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
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
      });

      if (!Array.isArray(data)) {
        if (reset) setRewards([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setRewards(prev => {
        if (reset) return data;
        const existingIds = new Set(prev.map(r => r.id));
        const filtered = data.filter(r => !existingIds.has(r.id));
        return [...prev, ...filtered];
      });

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      offsetRef.current += data.length;

    } catch (err) {
      console.error(`Fetch rewards error:`, err);
      setError(err instanceof Error ? err.message : `Failed to fetch rewards`);
    } finally {
      if (reset) setLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter]);

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

  const updateReward = (updatedReward: Reward) => {
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
