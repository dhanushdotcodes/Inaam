"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Gift, CheckCircle2, Circle, Loader2, AlertCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { getRewards, createReward, getRewardTasks, createTask, completeTask } from "@/lib/api";
import type { Reward, Task } from "@/types";

/**
 * Extended reward with its fetched tasks for display purposes.
 */
interface RewardWithTasks extends Reward {
  tasks: Task[];
  tasksLoading: boolean;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Dialog state */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /* Task Dialog State */
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardWithTasks | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  /**
   * Fetch all rewards and then fetch tasks for each reward.
   */
  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRewards();

      /* Initialize rewards with empty tasks and loading state */
      const rewardsWithTasks: RewardWithTasks[] = data.map((r) => ({
        ...r,
        tasks: [],
        tasksLoading: true,
      }));
      setRewards(rewardsWithTasks);

      /* Fetch tasks for each reward in parallel */
      const taskResults = await Promise.allSettled(
        data.map((r) => getRewardTasks(r.id))
      );

      setRewards((prev) =>
        prev.map((reward, index) => {
          const result = taskResults[index];
          return {
            ...reward,
            tasks: result.status === "fulfilled" ? result.value : [],
            tasksLoading: false,
          };
        })
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch rewards"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  /**
   * Handle creating a new reward via the dialog form.
   */
  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) {
      setFormError("Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      await createReward({
        title: trimmedTitle,
        description: formDescription.trim() || undefined,
      });

      /* Reset form and close dialog */
      setFormTitle("");
      setFormDescription("");
      setDialogOpen(false);

      /* Refresh the list */
      await fetchRewards();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create reward"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle adding a new task to the selected reward.
   */
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward || !newTaskTitle.trim()) return;

    try {
      setAddingTask(true);
      setTaskError(null);
      const newTask = await createTask(selectedReward.id, {
        title: newTaskTitle.trim(),
      });

      /* Update local state */
      const updatedReward = {
        ...selectedReward,
        tasks: [...selectedReward.tasks, newTask],
      };
      setSelectedReward(updatedReward);
      setRewards((prev) =>
        prev.map((r) => (r.id === selectedReward.id ? updatedReward : r))
      );
      setNewTaskTitle("");
    } catch (err) {
      setTaskError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  /**
   * Handle toggling task completion.
   */
  const handleToggleTask = async (rewardId: string, taskId: string) => {
    try {
      const updatedTask = await completeTask(rewardId, taskId);

      /* Update local state */
      setRewards((prev) =>
        prev.map((r) => {
          if (r.id !== rewardId) return r;
          const updatedTasks = r.tasks.map((t) =>
            t.id === taskId ? updatedTask : t
          );
          const updatedReward = { ...r, tasks: updatedTasks };
          if (selectedReward?.id === rewardId) {
            setSelectedReward(updatedReward);
          }
          return updatedReward;
        })
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  /**
   * Compute task completion stats for a reward.
   */
  const getTaskStats = (tasks: Task[]) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed };
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Rewards
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your rewards and track task progress.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={<Button id="create-reward-button" />}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Reward
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleCreateReward}>
              <DialogHeader>
                <DialogTitle>Create New Reward</DialogTitle>
                <DialogDescription>
                  Add a reward that you can unlock by completing tasks.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="reward-title"
                    className="text-sm font-medium"
                  >
                    Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="reward-title"
                    placeholder="e.g. Buy a new book"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    disabled={submitting}
                    maxLength={255}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="reward-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="reward-description"
                    placeholder="Optional details about this reward..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    disabled={submitting}
                    maxLength={1000}
                    rows={3}
                  />
                </div>

                {formError && (
                  <p className="text-sm text-destructive" role="alert">
                    {formError}
                  </p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
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
                  Create Reward
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mb-4 h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Loading rewards...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium text-destructive">{error}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Make sure the API server is running.
            </p>
          </div>
          <Button variant="outline" onClick={fetchRewards}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && rewards.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-12 text-center">
          <div className="rounded-xl bg-muted p-3">
            <Gift className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No rewards yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first reward to get started.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Reward
          </Button>
        </div>
      )}

      {/* Rewards Grid */}
      {!loading && !error && rewards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rewards.map((reward) => {
            const { total, completed } = getTaskStats(reward.tasks);
            const allDone = total > 0 && completed === total;

            return (
              <Card
                key={reward.id}
                className="transition-all hover:shadow-md cursor-pointer hover:border-primary/50"
                onClick={() => {
                  setSelectedReward(reward);
                  setTaskDialogOpen(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">
                        {reward.title}
                      </CardTitle>
                      {reward.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {reward.description}
                        </CardDescription>
                      )}
                    </div>
                    {reward.claimed ? (
                      <Badge variant="secondary">Claimed</Badge>
                    ) : allDone ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                        Ready
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {total === 0 ? "No tasks" : "In Progress"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Task Progress Summary */}
                  {reward.tasksLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">
                          {total === 0
                            ? "No tasks"
                            : `${completed}/${total} tasks`}
                        </span>
                        <span>{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{
                            width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {/* Task Details Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedReward && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <div>
                    <DialogTitle>{selectedReward.title}</DialogTitle>
                    <DialogDescription className="mt-1">
                      {selectedReward.description || "Manage tasks for this reward."}
                    </DialogDescription>
                  </div>
                  {selectedReward.claimed && (
                    <Badge variant="secondary">Claimed</Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Add Task Form */}
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

                {taskError && (
                  <p className="text-xs text-destructive">{taskError}</p>
                )}

                {/* Task List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
                    Tasks
                  </h4>
                  {selectedReward.tasks.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border border-dashed">
                      <p className="text-sm text-muted-foreground">No tasks yet.</p>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {selectedReward.tasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleTask(selectedReward.id, task.id)}
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
                    {getTaskStats(selectedReward.tasks).completed}/
                    {getTaskStats(selectedReward.tasks).total} tasks completed
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTaskDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
