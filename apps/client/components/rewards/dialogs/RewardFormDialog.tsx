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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createReward, updateReward, getRewardTasks, deleteTask } from "@/lib/api";
import type { Reward, Task } from "@/types";
import { RewardType } from "@/types";
import { FormField } from "@/components/ui/form-field";
import ObjectiveList from "../components/objectives/ObjectiveList";
import ObjectiveForm from "../components/objectives/ObjectiveForm";
import { useEffect } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface RewardFormDialogProps {
  reward?: Reward | null; // If provided, we are in edit mode
  defaultType?: RewardType; // Default type for new rewards
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * RewardFormDialog component — Modal form for adding or editing Quests and Prizes.
 */
export default function RewardFormDialog({
  reward,
  defaultType,
  open,
  onOpenChange,
  onSuccess,
}: RewardFormDialogProps) {
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [rewardType, setRewardType] = useState<RewardType>(reward?.reward_type || defaultType || RewardType.QUEST);
  const [costPoints, setCostPoints] = useState(reward?.cost_points || 10);
  const [objectives, setObjectives] = useState<Task[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);

  const isEdit = !!reward;

  const fetchObjectives = async () => {
    if (!reward?.id) return;
    try {
      setLoadingObjectives(true);
      const data = await getRewardTasks(reward.id);
      setObjectives(data);
    } catch (err) {
      console.error("Failed to fetch objectives:", err);
    } finally {
      setLoadingObjectives(false);
    }
  };

  useEffect(() => {
    if (open && isEdit && rewardType === RewardType.QUEST) {
      fetchObjectives();
    } else if (!open) {
      // Reset objectives when dialog closes
      setObjectives([]);
    }
  }, [open, isEdit, reward?.id, rewardType]);

  const handleDeleteObjective = async () => {
    if (!objectiveToDelete || !reward?.id) return;
    try {
      await deleteTask(objectiveToDelete, reward.id);
      setObjectives(objectives.filter(t => t.id !== objectiveToDelete));
      onSuccess();
    } catch (err) {
      console.error("Failed to delete objective:", err);
    } finally {
      setObjectiveToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (rewardType === RewardType.PRIZE && costPoints < 10) {
      setError("Points cost must be at least 10.");
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        reward_type: rewardType,
        cost_points: rewardType === RewardType.PRIZE ? costPoints : 0,
      };

      if (isEdit && reward) {
        await updateReward(reward.id, payload);
      } else {
        await createReward(payload);
      }

      /* Reset and close */
      setTitle("");
      setDescription("");
      setRewardType(RewardType.QUEST);
      setCostPoints(0);
      setObjectives([]);
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
    <>
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
                  placeholder={rewardType === RewardType.QUEST ? "e.g. Finish the Project" : "e.g. Buy a Pizza"}
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

              <div className="grid grid-cols-2 gap-4 w-full items-start">
                <FormField label="Type" className="w-full">
                  <Select
                    value={rewardType}
                    onValueChange={(value) => setRewardType(value as RewardType)}
                    disabled={isEdit || submitting}
                  >
                    <SelectTrigger className="w-full relative">
                      <SelectValue>
                        {rewardType === RewardType.QUEST ? "Quest (Task-based)" : "Prize (Points-based)"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="absolute top-0 left-0 -translate-x-25">
                      <SelectItem value={RewardType.QUEST}>Quest (Task-based)</SelectItem>
                      <SelectItem value={RewardType.PRIZE}>Prize (Points-based)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {rewardType === RewardType.PRIZE && (
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
                )}
              </div>

              {rewardType === RewardType.QUEST && isEdit && reward && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex flex-col gap-3">
                    <ObjectiveList
                      rewardId={reward.id}
                      tasks={objectives}
                      onObjectiveUpdate={(updated) => {
                        setObjectives(objectives.map(t => t.id === updated.id ? updated : t));
                        onSuccess(); // Refresh main view to update progress
                      }}
                      onObjectiveDeleteRequest={(taskId) => setObjectiveToDelete(taskId)}
                    />
                    <div className="pt-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 pl-1">
                        Add Objective
                      </p>
                      <ObjectiveForm
                        rewardId={reward.id}
                        onObjectiveAdded={(newTask) => {
                          setObjectives([...objectives, newTask]);
                          onSuccess();
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

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
                {isEdit ? "Save Changes" : `Create ${rewardType === RewardType.QUEST ? "Quest" : "Prize"}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!objectiveToDelete}
        onOpenChange={(open) => !open && setObjectiveToDelete(null)}
        title="Delete Objective"
        description="Are you sure you want to delete this objective? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteObjective}
        variant="destructive"
      />
    </>
  );
}
