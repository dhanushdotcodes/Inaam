"use client";

import { useState } from "react";
import { deleteReward, claimReward } from "@/lib/api";

/**
 * Hook for managing reward actions like deletion and claiming.
 */
export function useRewardActions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRewardAction = async (id: string, onSuccess?: () => void) => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteReward(id);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Delete reward error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete reward");
    } finally {
      setIsDeleting(false);
    }
  };

  const claimRewardAction = async (id: string, onSuccess?: () => void) => {
    try {
      setIsClaiming(true);
      setError(null);
      await claimReward(id);
      
      // Dispatch refreshPoints event for compatibility or update store directly
      window.dispatchEvent(new CustomEvent("refreshPoints"));
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Claim reward error:", err);
      setError(err instanceof Error ? err.message : "Failed to claim reward");
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    deleteRewardAction,
    claimRewardAction,
    isDeleting,
    isClaiming,
    actionError: error
  };
}
