"use client";

import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Reward } from "@/types";
import { RewardType } from "@/types";

import DashboardHeader from "@/components/layout/DashboardHeader";
import RewardCard from "./RewardCard";
import RewardFormDialog from "./dialogs/RewardFormDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import PointsDisplay from "../shared/PointsDisplay";

import { useRewards } from "@/hooks/useRewards";
import { useRewardActions } from "@/hooks/useRewardActions";
import PageShell, { PageContent } from "@/components/layout/PageShell";
import DashboardLoader from "@/components/shared/DashboardLoader";
import StatusError from "@/components/shared/StatusError";
import EmptyState from "@/components/shared/EmptyState";

/**
 * PrizesDashboard component — Specialized view for Prizes (economy-based rewards).
 */
export default function PrizesDashboard() {
  const { 
    rewards, 
    loading, 
    error, 
    refresh, 
    setRewards 
  } = useRewards(RewardType.PRIZE);

  const { 
    deleteRewardAction, 
    claimRewardAction, 
    isDeleting, 
    isClaiming 
  } = useRewardActions();

  /* Dialog states */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  /* Reward deletion & claiming state */
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const [claimingReward, setClaimingReward] = useState<Reward | null>(null);

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
      setRewardToDelete(null);
    });
  };

  const handleClaim = async () => {
    if (!claimingReward) return;
    await claimRewardAction(claimingReward.id, () => {
      setClaimingReward(null);
      refresh();
    });
  };

  /**
   * Sorting Logic:
   * 1. Unclaimed (Yet to be redeemed) at top.
   * 2. Claimed (Redeemed) at bottom.
   */
  const sortedPrizes = [...rewards].sort((a, b) => {
    const isAClaimed = !!a.claimed_at;
    const isBClaimed = !!b.claimed_at;

    if (isAClaimed !== isBClaimed) {
      return isAClaimed ? 1 : -1;
    }

    if (!isAClaimed) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    return new Date(b.claimed_at!).getTime() - new Date(a.claimed_at!).getTime();
  });

  return (
    <PageShell>
      <DashboardHeader 
        title="Prizes"
        description="Redeem your earned points for exclusive prizes."
      >
        <div className="flex w-full gap-2 items-center justify-between">
          <PointsDisplay />

          <Button 
            variant="contained"
            onClick={openCreateDialog} 
            startIcon={<Plus />}
          >
            New Prize
          </Button>
        </div>
      </DashboardHeader>

      <PageContent>
        {loading && rewards.length === 0 && (
          <DashboardLoader message="Syncing prize shop..." />
        )}

        {!loading && error && (
          <StatusError error={error} onRetry={refresh} />
        )}

        {!loading && !error && rewards.length === 0 && (
          <EmptyState 
            icon={ShoppingBag}
            title="Prize Shop Empty"
            description="There are no prizes available for redemption at the moment."
            action={{ label: "Add Prize", onClick: openCreateDialog }}
          />
        )}

        {!loading && !error && rewards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedPrizes.map((prize) => (
              <RewardCard 
                key={prize.id} 
                reward={prize} 
                onClick={() => setClaimingReward(prize)}
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
          defaultType={RewardType.PRIZE}
          open={formDialogOpen} 
          onOpenChange={setFormDialogOpen} 
          onSuccess={refresh}
        />

        <AlertDialog
          open={!!rewardToDelete}
          onOpenChange={(open) => !open && setRewardToDelete(null)}
          title="Delete Prize"
          description="Are you sure you want to delete this prize? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteReward}
          variant="destructive"
          isLoading={isDeleting}
        />

        {claimingReward && (
          <AlertDialog
            open={!!claimingReward}
            onOpenChange={(open) => !open && setClaimingReward(null)}
            title="Redeem Prize"
            description={`Are you sure you want to redeem "${claimingReward.title}" for ${claimingReward.cost_points} points?`}
            confirmText="Redeem"
            onConfirm={handleClaim}
            isLoading={isClaiming}
          />
        )}
      </PageContent>
    </PageShell>
  );
}
