"use client";

import type { Task } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  rewardId: string;
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDeleteRequest: (taskId: string) => void;
}

/**
 * TaskList component — Manages the display of tasks for a reward.
 */
export default function TaskList({
  rewardId,
  tasks,
  onTaskUpdate,
  onTaskDeleteRequest,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
        Tasks
      </h4>
      <ul className="space-y-1">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            rewardId={rewardId}
            task={task}
            onUpdate={onTaskUpdate}
            onDeleteRequest={onTaskDeleteRequest}
          />
        ))}
      </ul>
    </div>
  );
}
