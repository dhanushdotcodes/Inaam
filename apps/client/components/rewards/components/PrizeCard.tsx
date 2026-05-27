"use client";

import { Pencil, Trash2, ShoppingBag } from "lucide-react";
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
import type { Reward } from "@/types";
import { useAppStore } from "@/hooks/store";

interface PrizeCardProps {
  prize: Reward;
  onClick: () => void;
  onEdit?: (reward: Reward) => void;
  onDelete?: (id: string) => void;
}

/**
 * PrizeCard component — Displays summary of a Prize, its cost, and redemption progress.
 */
export default function PrizeCard({
  prize,
  onClick,
  onEdit,
  onDelete,
}: PrizeCardProps) {
  const isClaimed = !!prize.claimed_at;

  const { balance } = useAppStore((state) => state.points);
  const currentPoints = balance ?? 0;

  const progressPercent = prize.cost_points > 0
    ? Math.min(100, Math.round((currentPoints / prize.cost_points) * 100))
    : 0;

  return (
    <Card
      className={cn(
        "transition-all w-full group overflow-hidden min-w-64 border-neutral-100 dark:border-neutral-800 rounded-[24px]",
        isClaimed 
          ? "grayscale opacity-60 cursor-not-allowed bg-neutral-50/50 dark:bg-neutral-900/50" 
          : "hover:shadow-md cursor-pointer hover:border-primary/50 bg-card dark:bg-neutral-900"
      )}
      onClick={isClaimed ? undefined : onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Prize
              </span>
            </div>
            <CardTitle className={cn(
              "text-base truncate max-w-40 break-all tracking-tight",
              isClaimed && "text-muted-foreground"
            )}>
              {prize.title}
            </CardTitle>
            {prize.description && (
              <CardDescription className="mt-1 line-clamp-2 text-xs">
                {prize.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {isClaimed ? (
              <Badge variant="secondary" className="bg-neutral-200 dark:bg-neutral-800 text-neutral-500">Claimed</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-bold bg-primary/5 text-primary border-primary/20">
                {prize.cost_points.toLocaleString()} Pts
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
                      onEdit(prize);
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
                      onDelete(prize.id);
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
        {!isClaimed && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground dark:text-neutral-300">
                  {currentPoints.toLocaleString()} / {prize.cost_points.toLocaleString()} Pts
                </span>
                <span className="font-bold text-primary">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
