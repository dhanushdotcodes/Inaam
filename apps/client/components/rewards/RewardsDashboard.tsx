"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRewards, getRewardTasks, deleteReward } from "@/lib/api";
import { isAuthenticated, removeToken } from "@/lib/auth";
import type { Reward, RewardWithTasks } from "@/types";

import RewardsHeader from "./RewardsHeader";
import RewardCard from "./RewardCard";
import RewardFormDialog from "./dialogs/RewardFormDialog";
import TaskDetailsDialog from "./dialogs/TaskDetailsDialog";
import EmptyRewardsState from "./EmptyRewardsState";
import { AlertDialog } from "@/components/ui/alert-dialog";

/**
 * RewardsDashboard component — Main orchestrator for the rewards page.
 */
export default function RewardsDashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Dialog states */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardWithTasks | null>(null);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  /* Reward deletion state */
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const [isDeletingReward, setIsDeletingReward] = useState(false);

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

      if (!Array.isArray(data)) {
        setRewards([]);
        setLoading(false);
        return;
      }

      if (data.length === 0) {
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
      setLoading(false); // Show the grid with individual loaders

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
      setError(
        err instanceof Error ? err.message : "Failed to fetch rewards"
      );
      setLoading(false);
    } finally {
      // Ensure loading is false in all cases
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);


  const handleRewardUpdate = (updatedReward: RewardWithTasks) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === updatedReward.id ? updatedReward : r))
    );
    if (selectedReward?.id === updatedReward.id) {
      setSelectedReward(updatedReward);
    }
  };

  const openCreateDialog = () => {
    setRewardToEdit(null);
    setFormDialogOpen(true);
  };

  const handleEditReward = (reward: Reward) => {
    setRewardToEdit(reward);
    setFormDialogOpen(true);
  };

  const handleDeleteReward = async () => {
    if (!rewardToDelete) return;
    try {
      setIsDeletingReward(true);
      await deleteReward(rewardToDelete);
      setRewards((prev) => prev.filter((r) => r.id !== rewardToDelete));
      if (selectedReward?.id === rewardToDelete) {
        setTaskDialogOpen(false);
        setSelectedReward(null);
      }
      setRewardToDelete(null);
    } catch (err) {
      console.error("Failed to delete reward:", err);
    } finally {
      setIsDeletingReward(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <RewardsHeader 
        onNewReward={openCreateDialog} 
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
        <EmptyRewardsState onCreateClick={openCreateDialog} />
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
              onEdit={handleEditReward}
              onDelete={(id) => setRewardToDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <RewardFormDialog 
        key={rewardToEdit?.id || "new"}
        reward={rewardToEdit}
        open={formDialogOpen} 
        onOpenChange={setFormDialogOpen} 
        onSuccess={fetchRewards}
      />

      <TaskDetailsDialog 
        reward={selectedReward}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onUpdate={handleRewardUpdate}
      />

      <AlertDialog
        open={!!rewardToDelete}
        onOpenChange={(open) => !open && setRewardToDelete(null)}
        title="Delete Reward"
        description="Are you sure you want to delete this reward? All associated tasks will also be removed."
        confirmText="Delete"
        onConfirm={handleDeleteReward}
        variant="destructive"
        isLoading={isDeletingReward}
      />
    </main>
  );
}
