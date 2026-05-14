"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, AlertCircle, ShoppingBag, RefreshCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRewards, getRewardTasks, deleteReward, claimReward } from "@/lib/api";
import type { Reward, RewardWithTasks } from "@/types";
import { RewardType } from "@/types";

import DashboardHeader from "@/components/layout/DashboardHeader";
import RewardCard from "./RewardCard";
import RewardFormDialog from "./dialogs/RewardFormDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import PointsDisplay from "../shared/PointsDisplay";
import { cn } from "@/lib/utils";

/**
 * PrizesDashboard component — Specialized view for Prizes (economy-based rewards).
 */
export default function PrizesDashboard() {
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Dialog states */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  /* Reward deletion & claiming state */
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const [isDeletingReward, setIsDeletingReward] = useState(false);
  const [claimingReward, setClaimingReward] = useState<RewardWithTasks | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  /**
   * Fetch all rewards and filter for Prizes.
   */
  const fetchPrizes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRewards();

      if (!Array.isArray(data)) {
        setRewards([]);
        setLoading(false);
        return;
      }

      // Filter for Prizes immediately
      const prizeData = data.filter(r => r.reward_type === RewardType.PRIZE);

      if (prizeData.length === 0) {
        setRewards([]);
        setLoading(false);
        return;
      }

      // Prizes don't usually have tasks, but we fetch them just in case or for consistency
      const prizesWithTasks: RewardWithTasks[] = prizeData.map((r) => ({
        ...r,
        tasks: [],
        tasksLoading: true,
      }));
      setRewards(prizesWithTasks);
      setLoading(false);

      const taskResults = await Promise.allSettled(
        prizeData.map((r) => getRewardTasks(r.id))
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
      console.error("Fetch prizes error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch prizes");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

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
      setRewardToDelete(null);
    } catch (err) {
      console.error("Failed to delete prize:", err);
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
      fetchPrizes();
      window.dispatchEvent(new CustomEvent("refreshPoints"));
    } catch (err) {
      console.error("Redeem error:", err);
      setError(err instanceof Error ? err.message : "Failed to redeem prize");
    } finally {
      setIsClaiming(false);
    }
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
    <>
      <DashboardHeader 
        title="Prizes"
        description="Redeem your earned points for exclusive prizes."
      >
        <div className="flex items-center gap-3">
          <PointsDisplay />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-xl"
            onClick={fetchPrizes}
            disabled={loading}
          >
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button 
            variant="contained"
            onClick={openCreateDialog} 
            startIcon={<Plus />}
          >
            New Prize
          </Button>
        </div>
      </DashboardHeader>

      <main className="flex-1 px-8 lg:px-12 py-4">
        {loading && rewards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Syncing prize shop...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchPrizes}>Try Again</Button>
          </div>
        )}

        {!loading && !error && rewards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="h-12 w-12 text-zinc-200 mb-4" />
            <h3 className="text-lg font-bold mb-2">Prize Shop Empty</h3>
            <p className="text-sm text-muted-foreground mb-6">There are no prizes available for redemption at the moment.</p>
            <Button onClick={openCreateDialog}>Add Prize</Button>
          </div>
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
          onSuccess={fetchPrizes}
        />

        <AlertDialog
          open={!!rewardToDelete}
          onOpenChange={(open) => !open && setRewardToDelete(null)}
          title="Delete Prize"
          description="Are you sure you want to delete this prize? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteReward}
          variant="destructive"
          isLoading={isDeletingReward}
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
      </main>
    </>
  );
}
