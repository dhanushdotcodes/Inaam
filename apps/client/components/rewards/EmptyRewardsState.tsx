"use client";

import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRewardsStateProps {
  onCreateClick: () => void;
}

export default function EmptyRewardsState({ onCreateClick }: EmptyRewardsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-6 sm:p-12 text-center">
      <div className="rounded-xl bg-muted p-3">
        <Gift className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">No rewards yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first reward to get started.
        </p>
      </div>
      <Button onClick={onCreateClick}>
        Create Reward
      </Button>
    </div>
  );
}
