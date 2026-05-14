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
import { createReward, updateReward, getRewardTasks, deleteTask, updateTask } from "@/lib/api";
import type { Reward, Task } from "@/types";
import { RewardType } from "@/types";
import { FormField } from "@/components/ui/form-field";
import ObjectiveList from "../objectives/ObjectiveList";
import ObjectiveForm from "../objectives/ObjectiveForm";
import { useEffect } from "react";



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
  const [rewardType, setRewardType] = useState<RewardType>(reward?.reward_type || RewardType.QUEST);
  const [costPoints, setCostPoints] = useState(reward?.cost_points || 0);
  const [objectives, setObjectives] = useState<Task[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
                    <SelectItem value={RewardType.QUEST}>Quest (Task-based)</SelectItem>
                    <SelectItem value={RewardType.PRIZE}>Prize (Points-based)</SelectItem>
                  </SelectContent>

                </Select>
              </FormField>

              {rewardType === RewardType.PRIZE && (
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
                    onObjectiveDeleteRequest={async (taskId) => {
                      if (confirm("Are you sure you want to delete this objective?")) {
                        await deleteTask(taskId, reward.id);
                        setObjectives(objectives.filter(t => t.id !== taskId));
                        onSuccess();
                      }
                    }}
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
  );
}
