"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { getRewards, getRewardTasks, claimReward } from "@/lib/api";
import type { RewardWithTasks } from "@/types";
import RewardCard from "./RewardCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * RewardsOverview component — Displays the financial stats and transaction history.
 */
export default function RewardsOverview() {
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

      const rewardsWithTasks: RewardWithTasks[] = data.map((r) => ({
        ...r,
        tasks: [],
        tasksLoading: true,
      }));
      setRewards(rewardsWithTasks);

      const taskResults = await Promise.allSettled(
        data.map((r) => getRewardTasks(r.id))
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
      console.error("Fetch rewards error:", err);
      setError(err instanceof Error ? err.message : "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleClaim = async (rewardId: string) => {
    try {
      await claimReward(rewardId);
      // Refresh to update states
      fetchRewards();
    } catch (err) {
      console.error("Claim error:", err);
      alert(err instanceof Error ? err.message : "Failed to claim reward");
    }
  };

  // Filter rewards
  const availableRewards = rewards.filter(r => {
    const total = r.tasks.length;
    const completed = r.tasks.filter(t => t.completed).length;
    return total > 0 && completed === total && !r.claimed;
  });

  const claimedRewards = rewards.filter(r => r.claimed);

  return (
    <>
      <DashboardHeader 
        title="Rewards"
        description="Monitor your reward earnings and manage your financial assets."
      >
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-xl"
            onClick={fetchRewards}
            disabled={loading}
          >
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </DashboardHeader>

      <main className="flex-1 px-8 lg:px-12 py-4">
        {/* Loading/Error States */}
        {loading && rewards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Syncing your rewards...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive mb-8">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Available Rewards */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-5 text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Available to Claim
            {availableRewards.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {availableRewards.length}
              </span>
            )}
          </h3>
          
          {availableRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => (
                <RewardCard 
                  key={reward.id} 
                  reward={reward} 
                  onClick={() => handleClaim(reward.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-zinc-300" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                No rewards ready to claim. Complete all tasks in your vault to unlock rewards.
              </p>
            </div>
          )}
        </div>

        {/* Reward History (Claimed) */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-zinc-900 dark:text-zinc-50">Reward History</h3>
          {claimedRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedRewards.map((reward) => (
                <RewardCard 
                  key={reward.id} 
                  reward={reward} 
                  onClick={() => {}} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/30 dark:bg-zinc-900/30">
              <p className="text-sm text-zinc-400 italic">No claimed rewards yet.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
