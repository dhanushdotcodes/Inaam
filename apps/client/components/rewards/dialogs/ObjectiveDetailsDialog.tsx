"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { deleteTask } from "@/lib/api";
import type { RewardWithTasks, Task } from "@/types";
import { RewardType, TaskType } from "@/types";

import ObjectiveForm from "../components/objectives/ObjectiveForm";
import ObjectiveList from "../components/objectives/ObjectiveList";

interface ObjectiveDetailsDialogProps {
  reward: RewardWithTasks | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedReward: RewardWithTasks) => void;
}

/**
 * ObjectiveDetailsDialog component — Orchestrates objective management UI for a specific Quest.
 */
export default function ObjectiveDetailsDialog({
  reward,
  open,
  onOpenChange,
  onUpdate,
}: ObjectiveDetailsDialogProps) {
  /* Objective deletion confirmation state */
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);
  const [isDeletingObjective, setIsDeletingObjective] = useState(false);

  if (!reward) return null;

  const isQuest = reward.reward_type === RewardType.QUEST;

  const handleObjectiveAdded = (newTask: Task) => {
    onUpdate({
      ...reward,
      tasks: [...reward.tasks, newTask],
    });
  };

  const handleObjectiveUpdate = (updatedTask: Task) => {
    const updatedTasks = reward.tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t,
    );
    onUpdate({ ...reward, tasks: updatedTasks });
  };

  const handleDeleteObjective = async () => {
    if (!objectiveToDelete || !reward) return;
    try {
      setIsDeletingObjective(true);
      await deleteTask(reward.id, objectiveToDelete);
      const updatedTasks = reward.tasks.filter((t) => t.id !== objectiveToDelete);
      onUpdate({ ...reward, tasks: updatedTasks });
      setObjectiveToDelete(null);
    } catch (err) {
      console.error("Failed to delete objective:", err);
    } finally {
      setIsDeletingObjective(false);
    }
  };

  const completedCount = reward.tasks.filter((t) => t.completed).length;
  const totalCount = reward.tasks.length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isQuest ? "Quest Management" : "Prize Details"}
                  </span>
                </div>
                <DialogTitle className="wrap-break-word whitespace-normal">
                  {reward.title}
                </DialogTitle>
                <DialogDescription className="mt-1 wrap-break-word">
                  {reward.description || (isQuest ? "Complete these objectives to unlock this quest." : "Redeem this prize with your earned points.")}
                </DialogDescription>
              </div>
              {reward.claimed_at && (
                <Badge variant="secondary" className="shrink-0">
                  Claimed
                </Badge>
              )}
            </div>
          </DialogHeader>

          {isQuest ? (
            <div className="mt-4 space-y-6">
              <ObjectiveForm 
                rewardId={reward.id} 
                taskType={TaskType.OBJECTIVE} 
                onObjectiveAdded={handleObjectiveAdded} 
              />

              <ObjectiveList
                rewardId={reward.id}
                tasks={reward.tasks}
                onObjectiveUpdate={handleObjectiveUpdate}
                onObjectiveDeleteRequest={setObjectiveToDelete}
              />
            </div>
          ) : (
            <div className="mt-6 p-12 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center bg-muted/10">
               <p className="text-sm text-muted-foreground text-center">
                 Prizes are redeemed directly with points. No objectives required.
               </p>
               {!reward.claimed_at && (
                 <Button className="mt-6" variant="contained">
                   Redeem for {reward.cost_points} Points
                 </Button>
               )}
            </div>
          )}

          <DialogFooter className="mt-4 sm:justify-start">
            <div className="w-full flex items-center justify-between">
              {isQuest && (
                <div className="text-xs text-muted-foreground">
                  {completedCount}/{totalCount} objectives completed
                </div>
              )}
              <Button
                variant="outline"
                size="default"
                className="ml-auto"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
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
        isLoading={isDeletingObjective}
      />
    </>
  );
}
