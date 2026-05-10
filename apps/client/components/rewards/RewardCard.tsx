"use client";

import { Loader2 } from "lucide-react";
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
}

/**
 * RewardCard component — Displays summary of a reward and its task progress.
 */
export default function RewardCard({ reward, onClick }: RewardCardProps) {
  const total = reward.tasks.length;
  const completed = reward.tasks.filter((t) => t.completed).length;
  const allDone = total > 0 && completed === total;

  return (
    <Card
      className="transition-all hover:shadow-md cursor-pointer hover:border-primary/50 min-w-64"
      onClick={onClick}
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
