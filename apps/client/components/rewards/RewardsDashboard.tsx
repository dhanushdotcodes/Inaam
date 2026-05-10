"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRewards, getRewardTasks } from "@/lib/api";
import { isAuthenticated, removeToken } from "@/lib/auth";
import type { RewardWithTasks } from "@/types";

import RewardsHeader from "./RewardsHeader";
import RewardCard from "./RewardCard";
import CreateRewardDialog from "./CreateRewardDialog";
import TaskDetailsDialog from "./TaskDetailsDialog";
/**
 * RewardsDashboard component — Main orchestrator for the rewards page.
 */
export default function RewardsDashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Dialog states */
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardWithTasks | null>(null);

  // Protection: Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  /**
   * Fetch all rewards and then fetch tasks for each.
   */
  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRewards();

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
      setError(
        err instanceof Error ? err.message : "Failed to fetch rewards"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calling fetchRewards directly in useEffect can trigger a synchronous
    // setState (setLoading) which causes a cascading render warning.
    // Wrapping it in an async IIFE or using a check avoids this.
    const initialize = async () => {
      await fetchRewards();
    };
    initialize();
  }, [fetchRewards]);


  const handleRewardUpdate = (updatedReward: RewardWithTasks) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === updatedReward.id ? updatedReward : r))
    );
    if (selectedReward?.id === updatedReward.id) {
      setSelectedReward(updatedReward);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <RewardsHeader 
        onNewReward={() => setCreateDialogOpen(true)} 
        onLogout={handleLogout} 
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mb-4 h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Loading rewards...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium text-destructive">{error}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Make sure the API server is running.
            </p>
          </div>
          <Button variant="outline" onClick={fetchRewards}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && rewards.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-12 text-center">
          <div className="rounded-xl bg-muted p-3">
            <Gift className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No rewards yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first reward to get started.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            Create Reward
          </Button>
        </div>
      )}

      {/* Rewards Grid */}
      {!loading && !error && rewards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rewards.map((reward) => (
            <RewardCard 
              key={reward.id} 
              reward={reward} 
              onClick={() => {
                setSelectedReward(reward);
                setTaskDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateRewardDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSuccess={fetchRewards}
      />

      <TaskDetailsDialog 
        reward={selectedReward}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onUpdate={handleRewardUpdate}
      />
    </main>
  );
}
