"use client";

import React from "react";
import { ThemeToggle } from "../shared/ThemeToggle";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * DashboardHeader component — Common header for all dashboard pages.
 * Includes the page title/actions and theme toggle.
 */
export default function DashboardHeader({
  title,
  description,
  children,
}: DashboardHeaderProps) {

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-8 pt-8">
      <div className="flex items-center gap-4 min-w-0 flex-1">


        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </div>
  );
}
