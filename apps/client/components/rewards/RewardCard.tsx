"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Reward, Task } from "@/types";

interface RewardCardProps {
  reward: Reward & { tasks: Task[]; tasksLoading: boolean };
  onClick: () => void;
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
}

/**
 * RewardCard component — Displays summary of a reward and its task progress.
 */
export default function RewardCard({ reward, onClick, onEdit, onDelete }: RewardCardProps) {
  const total = reward.tasks.length;
  const completed = reward.tasks.filter((t) => t.completed).length;
  const allDone = total > 0 && completed === total;

  return (
    <Card
      className="transition-all hover:shadow-md cursor-pointer hover:border-primary/50 min-w-64 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {reward.title}
            </CardTitle>
            {reward.description && (
              <CardDescription className="mt-1 line-clamp-2 text-xs">
                {reward.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {reward.claimed ? (
              <Badge variant="secondary">Claimed</Badge>
            ) : allDone ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5">
                {total === 0 ? "No tasks" : "In Progress"}
              </Badge>
            )}
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(reward);
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
                  onDelete(reward.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
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
}
