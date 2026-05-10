"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { createTask, completeTask } from "@/lib/api";
import type { RewardWithTasks } from "@/types";

interface TaskDetailsDialogProps {
  reward: RewardWithTasks | null;

  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedReward: RewardWithTasks) => void;
}

/**
 * TaskDetailsDialog component — Manages tasks for a specific reward.
 */
export default function TaskDetailsDialog({ reward, open, onOpenChange, onUpdate }: TaskDetailsDialogProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reward) return null;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setAddingTask(true);
      setError(null);
      const newTask = await createTask(reward.id, {
        title: newTaskTitle.trim(),
      });

      onUpdate({
        ...reward,
        tasks: [...reward.tasks, newTask],
      });
      setNewTaskTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await completeTask(reward.id, taskId);
      const updatedTasks = reward.tasks.map((t) =>
        t.id === taskId ? updatedTask : t
      );
      onUpdate({ ...reward, tasks: updatedTasks });
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const completedCount = reward.tasks.filter((t) => t.completed).length;
  const totalCount = reward.tasks.length;

  return (
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
            {reward.claimed && (
              <Badge variant="secondary">Claimed</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={addingTask}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={addingTask || !newTaskTitle.trim()}>
              {addingTask ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </form>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
              Tasks
            </h4>
            {reward.tasks.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed">
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {reward.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="focus:outline-none"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
  );
}
