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
import { useAppStore } from "@/hooks/store";
import { cn } from "@/lib/utils";

import ObjectiveForm from "../components/objectives/ObjectiveForm";
import ObjectiveList from "../components/objectives/ObjectiveList";

interface ObjectiveDetailsDialogProps {
  reward: RewardWithTasks | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedReward: RewardWithTasks) => void;
  onRedeem?: (reward: RewardWithTasks) => void;
  isClaiming?: boolean;
}

/**
 * ObjectiveDetailsDialog component — Orchestrates objective management UI for a specific Quest.
 */
export default function ObjectiveDetailsDialog({
  reward,
  open,
  onOpenChange,
  onUpdate,
  onRedeem,
  isClaiming = false,
}: ObjectiveDetailsDialogProps) {
  const { balance } = useAppStore((state) => state.points);
  const currentPoints = balance ?? 0;

  /* Objective deletion confirmation state */
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);
  const [isDeletingObjective, setIsDeletingObjective] = useState(false);

  if (!reward) return null;

  const isQuest = reward.reward_type === RewardType.QUEST;
  const hasEnoughPoints = currentPoints >= reward.cost_points;

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
                  {isQuest ? "Complete these objectives to unlock this quest." : "Redeem this prize with your earned points."}
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
            <div className="mt-4 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col justify-center bg-muted/5">
              <p className="text-sm text-foreground leading-relaxed">
                {reward.description || "No description provided for this prize."}
              </p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {isQuest ? (
                <div className="text-xs text-muted-foreground">
                  {completedCount}/{totalCount} objectives completed
                </div>
              ) : (
                <div className="text-xs text-muted-foreground font-medium">
                  Cost: {reward.cost_points.toLocaleString()} Pts (Your Balance: {currentPoints.toLocaleString()} Pts)
                </div>
              )}
              <div className="flex items-center gap-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                
                {isQuest && !reward.claimed_at && (
                  <Button 
                    variant={completedCount === totalCount && totalCount > 0 ? "contained" : "outlined"}
                    disabled={!(completedCount === totalCount && totalCount > 0)}
                    isLoading={isClaiming}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      !(completedCount === totalCount && totalCount > 0) && "border-neutral-200 text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 dark:text-neutral-500"
                    )}
                    onClick={() => {
                      onRedeem?.(reward);
                    }}
                  >
                    Claim Reward
                  </Button>
                )}

                {!isQuest && !reward.claimed_at && (
                  <Button 
                    variant={hasEnoughPoints ? "contained" : "outlined"}
                    disabled={!hasEnoughPoints}
                    isLoading={isClaiming}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      !hasEnoughPoints && "border-neutral-200 text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 dark:text-neutral-500"
                    )}
                    onClick={() => {
                      onRedeem?.(reward);
                    }}
                  >
                    Redeem Prize
                  </Button>
                )}
              </div>
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
