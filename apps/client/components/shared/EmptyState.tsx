"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState component — Standardized UI for empty dashboard states.
 */
export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-6 transition-transform hover:scale-110">
        <Icon className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-70">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="contained">
          {action.label}
        </Button>
      )}
    </div>
  );
}
