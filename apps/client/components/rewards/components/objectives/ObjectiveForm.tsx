"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRewardTask } from "@/lib/api";
import type { Task } from "@/types";
import { TaskType } from "@/types";

interface ObjectiveFormProps {
  rewardId: string;
  taskType?: TaskType;
  onObjectiveAdded: (task: Task) => void;
}

/**
 * ObjectiveForm component — Inline form for adding objectives to a Quest.
 */
export default function ObjectiveForm({ rewardId, taskType = TaskType.OBJECTIVE, onObjectiveAdded }: ObjectiveFormProps) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const newTask = await createRewardTask(rewardId, {
        title: title.trim(),
        task_type: taskType
      });

      onObjectiveAdded(newTask);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add objective");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!submitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [submitting]);

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Add a new objective..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          className="flex-1"
          autoFocus
          ref={inputRef}
        />
        <Button type="submit" size="icon" disabled={submitting || !title.trim()}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
