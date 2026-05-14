"use client";

import type { Task } from "@/types";
import ObjectiveItem from "./ObjectiveItem";

interface ObjectiveListProps {
  rewardId: string;
  tasks: Task[];
  onObjectiveUpdate: (updatedTask: Task) => void;
  onObjectiveDeleteRequest: (taskId: string) => void;
}

/**
 * ObjectiveList component — Manages the display of objectives for a Quest.
 */
export default function ObjectiveList({
  rewardId,
  tasks,
  onObjectiveUpdate,
  onObjectiveDeleteRequest,
}: ObjectiveListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">No objectives yet.</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-2 w-full overflow-hidden">
      
      <h4 className="font-medium text-muted-foreground uppercase tracking-wider text-[10px] px-1">
        Objectives
      </h4>
      <ul className="space-y-1">
        {sortedTasks.map((task) => (
          <ObjectiveItem
            key={task.id}
            rewardId={rewardId}
            task={task}
            onUpdate={onObjectiveUpdate}
            onDeleteRequest={onObjectiveDeleteRequest}
          />
        ))}
      </ul>
    </div>
  );
}
