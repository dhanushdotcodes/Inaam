"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReward, updateReward } from "@/lib/api";
import type { Reward } from "@/types";
import { FormField } from "@/components/ui/form-field";

interface RewardFormDialogProps {
  reward?: Reward | null; // If provided, we are in edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * RewardFormDialog component — Modal form for adding or editing Rewards.
 */
export default function RewardFormDialog({
  reward,
  open,
  onOpenChange,
  onSuccess,
}: RewardFormDialogProps) {
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [costPoints, setCostPoints] = useState(reward?.cost_points || 10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!reward;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (costPoints < 10) {
      setError("Points cost must be at least 10.");
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        cost_points: costPoints,
      };

      if (isEdit && reward) {
        await updateReward(reward.id, payload);
      } else {
        await createReward(payload);
      }

      /* Reset and close */
      setTitle("");
      setDescription("");
      setCostPoints(10);
      onOpenChange(false);
      onSuccess();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "create"} reward`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Reward" : "New Reward"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the details of your reward."
                : "Create a new reward that can be claimed with points."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <FormField label="Title" required>
              <Input
                id="reward-title"
                placeholder="e.g. Buy a Pizza"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                maxLength={255}
                autoFocus
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                id="reward-description"
                placeholder="Details about this reward..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                maxLength={1000}
                rows={3}
              />
            </FormField>

            <FormField 
              label="Points Cost" 
              className="w-full"
              error={costPoints < 10 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium w-fit mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>Points must be at least 10</span>
                </div>
              )}
            >
              <Input
                id="cost-points"
                type="number"
                min={10}
                value={costPoints}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setCostPoints(val);
                  if (val >= 10) setError(null);
                }}
                disabled={submitting}
              />
            </FormField>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              id="submit-reward-button"
              type="submit"
              disabled={submitting}
            >
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Save Changes" : "Create Reward"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
