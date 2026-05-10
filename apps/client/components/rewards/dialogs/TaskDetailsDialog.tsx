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

import TaskForm from "../tasks/TaskForm";
import TaskList from "../tasks/TaskList";

interface TaskDetailsDialogProps {
  reward: RewardWithTasks | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedReward: RewardWithTasks) => void;
}

/**
 * TaskDetailsDialog component — Orchestrates task management UI for a specific reward.
 */
export default function TaskDetailsDialog({
  reward,
  open,
  onOpenChange,
  onUpdate,
}: TaskDetailsDialogProps) {
  /* Task deletion confirmation state */
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  if (!reward) return null;

  const handleTaskAdded = (newTask: Task) => {
    onUpdate({
      ...reward,
      tasks: [...reward.tasks, newTask],
    });
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = reward.tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    onUpdate({ ...reward, tasks: updatedTasks });
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete || !reward) return;
    try {
      setIsDeletingTask(true);
      await deleteTask(reward.id, taskToDelete);
      const updatedTasks = reward.tasks.filter((t) => t.id !== taskToDelete);
      onUpdate({ ...reward, tasks: updatedTasks });
      setTaskToDelete(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const completedCount = reward.tasks.filter((t) => t.completed).length;
  const totalCount = reward.tasks.length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle>{reward.title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {reward.description || "Manage tasks for this reward."}
                </DialogDescription>
              </div>
              {reward.claimed && <Badge variant="secondary">Claimed</Badge>}
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <TaskForm rewardId={reward.id} onTaskAdded={handleTaskAdded} />

            <TaskList
              rewardId={reward.id}
              tasks={reward.tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDeleteRequest={setTaskToDelete}
            />
          </div>

          <DialogFooter className="mt-4 sm:justify-start">
            <div className="w-full flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {completedCount}/{totalCount} tasks completed
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteTask}
        variant="destructive"
        isLoading={isDeletingTask}
      />
    </>
  );
}
