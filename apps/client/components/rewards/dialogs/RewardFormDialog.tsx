"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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

interface RewardFormDialogProps {
  reward?: Reward | null; // If provided, we are in edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * RewardFormDialog component — Modal form for adding or editing rewards.
 */
export default function RewardFormDialog({
  reward,
  open,
  onOpenChange,
  onSuccess,
}: RewardFormDialogProps) {
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
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

    try {
      setSubmitting(true);
      
      if (isEdit && reward) {
        await updateReward(reward.id, {
          title: trimmedTitle,
          description: description.trim() || undefined,
        });
      } else {
        await createReward({
          title: trimmedTitle,
          description: description.trim() || undefined,
        });
      }

      /* Reset and close */
      setTitle("");
      setDescription("");
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
            <DialogTitle>{isEdit ? "Edit Reward" : "Create New Reward"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the details of your reward."
                : "Add a reward that you can unlock by completing tasks."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="reward-title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="reward-title"
                placeholder="e.g. Buy a new book"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                maxLength={255}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reward-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="reward-description"
                placeholder="Optional details about this reward..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                maxLength={1000}
                rows={3}
              />
            </div>

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
