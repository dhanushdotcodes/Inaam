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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createReward, updateReward } from "@/lib/api";
import type { Reward } from "@/types";
import { RewardType } from "@/types";
import { FormField } from "@/components/ui/form-field";


interface RewardFormDialogProps {
  reward?: Reward | null; // If provided, we are in edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * RewardFormDialog component — Modal form for adding or editing Quests and Prizes.
 */
export default function RewardFormDialog({
  reward,
  open,
  onOpenChange,
  onSuccess,
}: RewardFormDialogProps) {
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [rewardType, setRewardType] = useState<RewardType>(reward?.reward_type || RewardType.DIRECT);
  const [costPoints, setCostPoints] = useState(reward?.cost_points || 0);
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
      
      const payload = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        reward_type: rewardType,
        cost_points: rewardType === RewardType.ECONOMY ? costPoints : 0,
      };

      if (isEdit && reward) {
        await updateReward(reward.id, payload);
      } else {
        await createReward(payload);
      }

      /* Reset and close */
      setTitle("");
      setDescription("");
      setRewardType(RewardType.DIRECT);
      setCostPoints(0);
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
                ? "Update the details of your quest or prize."
                : "Create a Quest (task-based) or a Prize (points-based)."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <FormField label="Title" required>
              <Input
                id="reward-title"
                placeholder={rewardType === RewardType.DIRECT ? "e.g. Finish the Project" : "e.g. Buy a Pizza"}
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


            <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-between">
              <FormField label="Type" className="w-full">
                <Select
                  value={rewardType}
                  onValueChange={(value) => setRewardType(value as RewardType)}
                  disabled={isEdit || submitting}
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RewardType.DIRECT}>Quest (Task-based)</SelectItem>
                    <SelectItem value={RewardType.ECONOMY}>Prize (Points-based)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              {rewardType === RewardType.ECONOMY && (
                <FormField label="Points Cost" className="w-full">
                  <Input
                    id="cost-points"
                    type="number"
                    value={costPoints}
                    onChange={(e) => setCostPoints(parseInt(e.target.value))}
                    disabled={submitting}
                  />
                </FormField>
              )}
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
              {isEdit ? "Save Changes" : `Create ${rewardType === RewardType.DIRECT ? "Quest" : "Prize"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
