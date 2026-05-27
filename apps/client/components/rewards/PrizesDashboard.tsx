"use client";

import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/layout/DashboardHeader";
import PrizeCard from "./components/PrizeCard";
import RewardFilters from "./components/RewardFilters";
import RewardFormDialog from "./dialogs/RewardFormDialog";

import { AlertDialog } from "@/components/ui/alert-dialog";
import PointsDisplay from "../shared/PointsDisplay";
import type { Reward } from "@/types";


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
    filteredRewards,
    loading, 
    error, 
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hasMore,
    loadMore,
    refresh, 
    updateReward,
    setRewards 
  } = useRewards();

  const { 
    deleteRewardAction, 
    claimRewardAction, 
    isDeleting, 
    isClaiming 
  } = useRewardActions();

  /* Dialog states */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  /* Reward deletion state */
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const handleRewardUpdate = (updatedReward: Reward) => {
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
      setRewardToDelete(null);
    });
  };

  const handleClaim = async (reward: Reward) => {
    await claimRewardAction(reward.id, () => {
      setDetailsDialogOpen(false);
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

      <PageContent className="space-y-6">
        <RewardFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={statusFilter}
          onFilterChange={setStatusFilter}
          placeholder="Search prizes..."
          layoutIdPrefix="prize"
        />

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

        {!loading && !error && filteredRewards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredRewards.map((prize) => (
              <PrizeCard 
                key={prize.id} 
                prize={prize} 
                onClick={() => {
                  setSelectedReward(prize);
                  setDetailsDialogOpen(true);
                }}
                onEdit={handleEditReward}
                onDelete={(id) => setRewardToDelete(id)}
              />
            ))}
          </div>
        )}
        
        {!loading && !error && hasMore && (
          <div className="mt-8 flex justify-center pb-8">
            <Button 
              onClick={loadMore} 
              variant="ghost"
              isLoading={loading}
            >
              Load more prizes...
            </Button>
          </div>
        )}

        {/* Dialogs */}
        <RewardFormDialog 
          key={rewardToEdit?.id || "new"}
          reward={rewardToEdit}

          open={formDialogOpen} 
          onOpenChange={setFormDialogOpen} 
          onSuccess={refresh}
        />

        <AlertDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          title="Redeem Prize"
          description={
            selectedReward
              ? `Are you sure you want to redeem "${selectedReward.title}" for ${selectedReward.cost_points} points?`
              : ""
          }
          confirmText="Redeem"
          onConfirm={() => selectedReward && handleClaim(selectedReward)}
          isLoading={isClaiming}
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
      </PageContent>
    </PageShell>
  );
}
