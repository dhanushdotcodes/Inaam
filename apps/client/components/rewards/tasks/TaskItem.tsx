"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTask } from "@/lib/api";
import type { Task } from "@/types";
import { motion } from "motion/react";

interface TaskItemProps {
  rewardId: string;
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDeleteRequest: (taskId: string) => void;
}

/**
 * TaskItem component — Represents a single task with toggle, edit, and delete actions.
 */
export default function TaskItem({
  rewardId,
  task,
  onUpdate,
  onDeleteRequest,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(task.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    try {
      const updated = await updateTask(rewardId, task.id, {
        completed: !task.completed,
      });
      onUpdate(updated);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTitle.trim() || editingTitle === task.title) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await updateTask(rewardId, task.id, {
        title: editingTitle.trim(),
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.li 
      layout
      className={`flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group ${!isEditing ? "cursor-pointer" : ""}`}
      onClick={() => !isEditing && handleToggle()}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="focus:outline-none shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="h-8 py-0 px-2"
              autoFocus
              disabled={isUpdating}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-emerald-600"
              onClick={handleSaveEdit}
              disabled={isUpdating || !editingTitle.trim()}
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => {
                setIsEditing(false);
                setEditingTitle(task.title);
              }}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span
            className={`text-sm wrap-break-word whitespace-normal break-all max-w-full ${
              task.completed
                ? "text-muted-foreground line-through"
                : "text-foreground font-medium"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(task.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </motion.li>
  );
}
