"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, AlertCircle, Trophy, RefreshCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRewards, getRewardTasks, deleteReward, claimReward } from "@/lib/api";
import type { Reward, RewardWithTasks } from "@/types";
import { RewardType } from "@/types";

import DashboardHeader from "@/components/layout/DashboardHeader";
import RewardCard from "./RewardCard";
import RewardFormDialog from "./dialogs/RewardFormDialog";
import ObjectiveDetailsDialog from "./dialogs/ObjectiveDetailsDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import PointsDisplay from "../shared/PointsDisplay";
import { cn } from "@/lib/utils";

/**
 * QuestsDashboard component — Specialized view for Quests (task-based rewards).
 */
export default function QuestsDashboard() {
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Dialog states */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardWithTasks | null>(null);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  /* Reward deletion & claiming state */
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const [isDeletingReward, setIsDeletingReward] = useState(false);
  const [claimingReward, setClaimingReward] = useState<RewardWithTasks | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  /**
   * Fetch all rewards and filter for Quests.
   */
  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRewards();

      if (!Array.isArray(data)) {
        setRewards([]);
        setLoading(false);
        return;
      }

      // Filter for Quests immediately
      const questData = data.filter(r => r.reward_type === RewardType.QUEST);

      if (questData.length === 0) {
        setRewards([]);
        setLoading(false);
        return;
      }

      const questsWithTasks: RewardWithTasks[] = questData.map((r) => ({
        ...r,
        tasks: [],
        tasksLoading: true,
      }));
      setRewards(questsWithTasks);
      setLoading(false);

      const taskResults = await Promise.allSettled(
        questData.map((r) => getRewardTasks(r.id))
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
      console.error("Fetch quests error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch quests");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

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
        setObjectiveDialogOpen(false);
        setSelectedReward(null);
      }
      setRewardToDelete(null);
    } catch (err) {
      console.error("Failed to delete quest:", err);
    } finally {
      setIsDeletingReward(false);
    }
  };

  const handleClaim = async () => {
    if (!claimingReward) return;
    try {
      setIsClaiming(true);
      await claimReward(claimingReward.id);
      setClaimingReward(null);
      fetchQuests();
      window.dispatchEvent(new CustomEvent("refreshPoints"));
    } catch (err) {
      console.error("Claim error:", err);
      setError(err instanceof Error ? err.message : "Failed to claim reward");
    } finally {
      setIsClaiming(false);
    }
  };

  /**
   * Sorting Logic:
   * 1. Ongoing quests (progress > 0 && progress < 100) and Ready to Claim (progress == 100) first.
   *    - "currently going on are at the top"
   * 2. Claimed quests at the bottom.
   */
  const sortedQuests = [...rewards].sort((a, b) => {
    const isAClaimed = !!a.claimed_at;
    const isBClaimed = !!b.claimed_at;

    // 1. Claimed at bottom
    if (isAClaimed !== isBClaimed) {
      return isAClaimed ? 1 : -1;
    }

    if (!isAClaimed) {
      // Both unclaimed
      const getProgress = (r: RewardWithTasks) => {
        if (r.tasks.length === 0) return 0;
        return (r.tasks.filter(t => t.completed).length / r.tasks.length) * 100;
      };

      const progressA = getProgress(a);
      const progressB = getProgress(b);

      // Prioritize ongoing (0 < progress < 100) over ready (100) and not started (0)
      // Actually, user said "going on at the top". Let's put progress > 0 first.
      const isAOngoing = progressA > 0 && progressA < 100;
      const isBOngoing = progressB > 0 && progressB < 100;

      if (isAOngoing !== isBOngoing) {
        return isAOngoing ? -1 : 1;
      }

      // If both ongoing or both not started/ready, sort by progress desc
      if (progressA !== progressB) {
        return progressB - progressA;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    // Both claimed, sort by claimed_at desc
    return new Date(b.claimed_at!).getTime() - new Date(a.claimed_at!).getTime();
  });

  return (
    <>
      <DashboardHeader 
        title="Quests"
        description="Master your objectives and unlock epic rewards."
      >
        <div className="flex items-center gap-3">
          <PointsDisplay />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-xl"
            onClick={fetchQuests}
            disabled={loading}
          >
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button 
            variant="contained"
            onClick={openCreateDialog} 
            startIcon={<Plus />}
          >
            New Quest
          </Button>
        </div>
      </DashboardHeader>

      <main className="flex-1 px-8 lg:px-12 py-4">
        {loading && rewards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Syncing your quests...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchQuests}>Try Again</Button>
          </div>
        )}

        {!loading && !error && rewards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="h-12 w-12 text-zinc-200 mb-4" />
            <h3 className="text-lg font-bold mb-2">No Quests Found</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first quest to start earning rewards.</p>
            <Button onClick={openCreateDialog}>Create Quest</Button>
          </div>
        )}

        {!loading && !error && rewards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedQuests.map((quest) => (
              <RewardCard 
                key={quest.id} 
                reward={quest} 
                onClick={() => {
                  if (quest.tasks.length > 0 && quest.tasks.every(t => t.completed)) {
                    setClaimingReward(quest);
                  } else {
                    setSelectedReward(quest);
                    setObjectiveDialogOpen(true);
                  }
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
          defaultType={RewardType.QUEST}
          open={formDialogOpen} 
          onOpenChange={setFormDialogOpen} 
          onSuccess={fetchQuests}
        />

        <ObjectiveDetailsDialog 
          reward={selectedReward}
          open={objectiveDialogOpen}
          onOpenChange={setObjectiveDialogOpen}
          onUpdate={handleRewardUpdate}
        />

        <AlertDialog
          open={!!rewardToDelete}
          onOpenChange={(open) => !open && setRewardToDelete(null)}
          title="Delete Quest"
          description="Are you sure you want to delete this quest? All linked objectives will also be removed."
          confirmText="Delete"
          onConfirm={handleDeleteReward}
          variant="destructive"
          isLoading={isDeletingReward}
        />

        {claimingReward && (
          <AlertDialog
            open={!!claimingReward}
            onOpenChange={(open) => !open && setClaimingReward(null)}
            title="Claim Quest Reward"
            description={`Are you sure you want to claim your reward for "${claimingReward.title}"?`}
            confirmText="Claim"
            onConfirm={handleClaim}
            isLoading={isClaiming}
          />
        )}
      </main>
    </>
  );
}
