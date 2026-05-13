"use client";

import { Loader2, Pencil, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  onEdit?: (reward: Reward) => void;
  onDelete?: (id: string) => void;
}

/**
 * RewardCard component — Displays summary of a reward and its task progress.
 */
export default function RewardCard({
  reward,
  onClick,
  onEdit,
  onDelete,
}: RewardCardProps) {
  const total = reward.tasks.length;
  const completed = reward.tasks.filter((t) => t.completed).length;
  const allDone = total > 0 && completed === total;
  const isClaimed = !!reward.claimed_at;

  return (
    <Card
      className={cn(
        "transition-all w-full group overflow-hidden min-w-64 border-zinc-100 dark:border-zinc-800",
        isClaimed 
          ? "grayscale opacity-60 cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-900/50" 
          : "hover:shadow-md cursor-pointer hover:border-primary/50 bg-white dark:bg-zinc-900"
      )}
      onClick={isClaimed ? undefined : onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className={cn(
              "text-base truncate max-w-40 break-all",
              isClaimed && "text-muted-foreground"
            )}>
              {reward.title}
            </CardTitle>
            {reward.description && (
              <CardDescription className="mt-1 line-clamp-2 text-xs">
                {reward.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {isClaimed ? (
              <Badge variant="secondary" className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500">Claimed</Badge>
            ) : allDone ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5 flex gap-1 items-center bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                <Lock className="h-2.5 w-2.5 text-zinc-400" />
                <span className="text-zinc-500">{total === 0 ? "Empty" : "Locked"}</span>
              </Badge>
            )}

            {!isClaimed && (onEdit || onDelete) && (
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {onEdit && (
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
                )}
                {onDelete && (
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
                )}
              </div>
            )}
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
              <span className={cn("font-medium", isClaimed && "text-zinc-400")}>
                {total === 0 ? "No tasks" : `${completed}/${total} tasks`}
              </span>
              <span className={isClaimed ? "text-zinc-400" : ""}>
                {total > 0 ? Math.round((completed / total) * 100) : 0}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isClaimed ? "bg-zinc-300 dark:bg-zinc-700" : "bg-primary"
                )}
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
