"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Wallet, Trophy, ShoppingBag, RefreshCcw, Loader2, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { getRewards, getRewardTasks, claimReward } from "@/lib/api";
import type { RewardWithTasks } from "@/types";
import { RewardType } from "@/types";
import RewardCard from "./RewardCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PointsDisplay from "../shared/PointsDisplay";
import { AlertDialog } from "@/components/ui/alert-dialog";

/**
 * RewardsOverview component — Displays Quests (task-based) and Prizes (economy-based).
 */
export default function RewardsOverview() {
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingReward, setClaimingReward] = useState<RewardWithTasks | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

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

  const handleClaim = async () => {
    if (!claimingReward) return;
    
    try {
      setIsClaiming(true);
      await claimReward(claimingReward.id);
      setClaimingReward(null);
      fetchRewards();
      window.dispatchEvent(new CustomEvent("refreshPoints"));
    } catch (err) {
      console.error("Claim error:", err);
      setError(err instanceof Error ? err.message : "Failed to claim reward");
    } finally {
      setIsClaiming(false);
    }
  };

  // Filter rewards
  const quests = rewards
    .filter(r => {
      if (r.reward_type !== RewardType.QUEST || r.claimed_at) return false;
      if (r.tasksLoading) return false;
      const total = r.tasks.length;
      const completed = r.tasks.filter(t => t.completed).length;
      return total > 0 && completed === total;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const prizes = rewards
    .filter(r => r.reward_type === RewardType.PRIZE && !r.claimed_at)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <>
      <DashboardHeader 
        title="Rewards"
        description="Claim your achieved Quests or spend points on legendary Prizes."
      >
        <div className="flex items-center gap-3">
          <PointsDisplay />
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

      <main className="flex-1 px-8 lg:px-12 py-4 space-y-12">
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

        {/* Quests Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 tracking-[-0.02em]">
              <Trophy className="h-5 w-5 text-amber-500" />
              Completed Quests
              {quests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black">
                  {quests.length} READY
                </span>
              )}
            </h3>
          </div>
          
          {quests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quests.map((quest) => (
                <RewardCard 
                  key={quest.id} 
                  reward={quest} 
                  onClick={() => setClaimingReward(quest)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center bg-muted/20">
              <p className="text-sm text-muted-foreground">No active quests. Start one to begin your journey.</p>
            </div>
          )}
        </section>

        {/* Prizes Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 tracking-[-0.02em]">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Prize Shop
            </h3>
          </div>
          
          {prizes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prizes.map((prize) => (
                <RewardCard 
                  key={prize.id} 
                  reward={prize} 
                  onClick={() => setClaimingReward(prize)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center bg-muted/20">
              <p className="text-sm text-muted-foreground">The shop is empty for now. Check back later!</p>
            </div>
          )}
        </section>
      </main>

      {claimingReward && (
        <AlertDialog
          open={!!claimingReward}
          onOpenChange={(open) => !open && setClaimingReward(null)}
          title={claimingReward.reward_type === RewardType.QUEST ? "Claim Reward" : "Redeem Prize"}
          description={
            claimingReward.reward_type === RewardType.QUEST 
              ? `Are you sure you want to claim your reward for "${claimingReward.title}"?`
              : `Are you sure you want to redeem "${claimingReward.title}" for ${claimingReward.cost_points} points?`
          }
          confirmText={claimingReward.reward_type === RewardType.QUEST ? "Claim" : "Redeem"}
          onConfirm={handleClaim}
          isLoading={isClaiming}
        />
      )}
    </>
  );
}
