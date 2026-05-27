"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Reward, RewardWithTasks } from "@/types";
import { RewardType } from "@/types";

import DashboardHeader from "@/components/layout/DashboardHeader";
import QuestCard from "./components/QuestCard";
import RewardFormDialog from "./dialogs/RewardFormDialog";
import ObjectiveDetailsDialog from "./dialogs/ObjectiveDetailsDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import PointsDisplay from "../shared/PointsDisplay";

import { useRewards } from "@/hooks/useRewards";
import { useRewardActions } from "@/hooks/useRewardActions";
import PageShell, { PageContent } from "@/components/layout/PageShell";
import DashboardLoader from "@/components/shared/DashboardLoader";
import StatusError from "@/components/shared/StatusError";
import EmptyState from "@/components/shared/EmptyState";
import { Trophy } from "lucide-react";

/**
 * QuestsDashboard component — Specialized view for Quests (task-based rewards).
 */
export default function QuestsDashboard() {
  const { 
    rewards, 
    loading, 
    error, 
    refresh, 
    updateReward, 
    setRewards 
  } = useRewards(RewardType.QUEST);

  const { 
    deleteRewardAction, 
    claimRewardAction, 
    isDeleting, 
    isClaiming 
  } = useRewardActions();

  /* Dialog states */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardWithTasks | null>(null);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  /* Reward deletion state */
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);

  const handleRewardUpdate = (updatedReward: RewardWithTasks) => {
    updateReward(updatedReward);
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
    await deleteRewardAction(rewardToDelete, () => {
      setRewards((prev) => prev.filter((r) => r.id !== rewardToDelete));
      if (selectedReward?.id === rewardToDelete) {
        setObjectiveDialogOpen(false);
        setSelectedReward(null);
      }
      setRewardToDelete(null);
    });
  };

  const handleClaim = async (reward: RewardWithTasks) => {
    await claimRewardAction(reward.id, () => {
      setObjectiveDialogOpen(false);
      refresh();
    });
  };

  /**
   * Sorting Logic:
   * 1. Ongoing quests (progress > 0 && progress < 100) and Ready to Claim (progress == 100) first.
   * 2. Claimed quests at the bottom.
   */
  const sortedQuests = [...rewards].sort((a, b) => {
    const isAClaimed = !!a.claimed_at;
    const isBClaimed = !!b.claimed_at;

    if (isAClaimed !== isBClaimed) {
      return isAClaimed ? 1 : -1;
    }

    if (!isAClaimed) {
      const getProgress = (r: RewardWithTasks) => {
        if (r.tasks.length === 0) return 0;
        return (r.tasks.filter(t => t.completed).length / r.tasks.length) * 100;
      };

      const progressA = getProgress(a);
      const progressB = getProgress(b);

      const isAOngoing = progressA > 0 && progressA < 100;
      const isBOngoing = progressB > 0 && progressB < 100;

      if (isAOngoing !== isBOngoing) {
        return isAOngoing ? -1 : 1;
      }

      if (progressA !== progressB) {
        return progressB - progressA;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    return new Date(b.claimed_at!).getTime() - new Date(a.claimed_at!).getTime();
  });

  return (
    <PageShell>
      <DashboardHeader 
        title="Quests"
        description="Master your objectives and unlock epic rewards."
      >
        <div className="flex w-full gap-2 items-center justify-between">
          <PointsDisplay />

          <Button 
            variant="contained"
            onClick={openCreateDialog} 
            startIcon={<Plus />}
          >
            New Quest
          </Button>
        </div>
      </DashboardHeader>

      <PageContent>
        {loading && rewards.length === 0 && (
          <DashboardLoader message="Syncing your quests..." />
        )}

        {!loading && error && (
          <StatusError error={error} onRetry={refresh} />
        )}

        {!loading && !error && rewards.length === 0 && (
          <EmptyState 
            icon={Trophy}
            title="No Quests Found"
            description="Create your first quest to start earning rewards."
            action={{ label: "Create Quest", onClick: openCreateDialog }}
          />
        )}

        {!loading && !error && rewards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedQuests.map((quest) => (
              <QuestCard 
                key={quest.id} 
                quest={quest} 
                onClick={() => {
                  setSelectedReward(quest);
                  setObjectiveDialogOpen(true);
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
          onSuccess={refresh}
        />

        <ObjectiveDetailsDialog 
          reward={selectedReward}
          open={objectiveDialogOpen}
          onOpenChange={setObjectiveDialogOpen}
          onUpdate={handleRewardUpdate}
          onRedeem={handleClaim}
          isClaiming={isClaiming}
        />

        <AlertDialog
          open={!!rewardToDelete}
          onOpenChange={(open) => !open && setRewardToDelete(null)}
          title="Delete Quest"
          description="Are you sure you want to delete this quest? All linked objectives will also be removed."
          confirmText="Delete"
          onConfirm={handleDeleteReward}
          variant="destructive"
          isLoading={isDeleting}
        />
      </PageContent>
    </PageShell>
  );
}
