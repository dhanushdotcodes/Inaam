"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageShell component — Standardized container for consistent dashboard layout.
 * Provides consistent padding and structure across all feature pages.
 */
export default function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("flex flex-col min-h-screen pb-20 lg:pb-8", className)}>
      {children}
    </div>
  );
}

/**
 * PageContent component — Inner container for dashboard content.
 */
export function PageContent({ children, className }: PageShellProps) {
  return (
    <main className={cn("flex-1 px-8 lg:px-12", className)}>
      {children}
    </main>
  );
}
