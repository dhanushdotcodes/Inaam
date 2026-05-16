"use client";

import { Loader2, Pencil, Trash2, Lock, ShoppingBag, Trophy } from "lucide-react";
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
import { RewardType } from "@/types";

interface RewardCardProps {
  reward: Reward & { tasks: Task[]; tasksLoading: boolean };
  onClick: () => void;
  onEdit?: (reward: Reward) => void;
  onDelete?: (id: string) => void;
}

/**
 * RewardCard component — Displays summary of a Quest or Prize and its status.
 */
export default function RewardCard({
  reward,
  onClick,
  onEdit,
  onDelete,
}: RewardCardProps) {
  const isQuest = reward.reward_type === RewardType.QUEST;
  const isPrize = reward.reward_type === RewardType.PRIZE;

  
  const total = reward.tasks.length;
  const completed = reward.tasks.filter((t) => t.completed).length;
  const allDone = isQuest && completed === total;
  const isClaimed = !!reward.claimed_at;

  return (
    <Card
      className={cn(
        "transition-all w-full group overflow-hidden min-w-64 border-zinc-100 dark:border-zinc-800 rounded-[24px]",
        isClaimed 
          ? "grayscale opacity-60 cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-900/50" 
          : "hover:shadow-md cursor-pointer hover:border-primary/50 bg-white dark:bg-zinc-900"
      )}
      onClick={isClaimed ? undefined : onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 flex items-center justify-center">
                {isQuest ? (
                  <Trophy className="h-4 w-4 text-amber-500" />
                ) : (
                  <ShoppingBag className="h-4 w-4 text-primary" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {isQuest ? "Quest" : "Prize"}
              </span>
            </div>
            <CardTitle className={cn(
              "text-base truncate max-w-40 break-all tracking-[-0.02em]",
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
            ) : isQuest && allDone ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                Ready
              </Badge>
            ) : isPrize ? (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-bold bg-primary/5 text-primary border-primary/20">
                {reward.cost_points} Pts
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5 flex gap-1 items-center bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                <div className="w-3 h-3 flex items-center justify-center">
                  <Lock className="h-2.5 w-2.5 text-zinc-400" />
                </div>
                <span className="text-zinc-500">Locked</span>
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
        {isQuest && (
          reward.tasksLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className={cn("font-medium", isClaimed && "text-zinc-400")}>
                  {total === 0 ? "No objectives" : `${completed}/${total} objectives`}
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
          )
        )}
        
        {isPrize && !isClaimed && (
          <div className="pt-2">
            <Button variant="contained" className="w-full text-[10px] font-black uppercase tracking-widest">
              Redeem Prize
            </Button>
          </div>
        )}
      </CardContent>
    </Card>

  );
}
