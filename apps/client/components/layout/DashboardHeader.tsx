"use client";

import React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/store";
import { motion } from "motion/react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * DashboardHeader component — Common header for all dashboard pages.
 * Includes the sidebar toggle and page title/actions.
 */
export default function DashboardHeader({
  title,
  description,
  children,
}: DashboardHeaderProps) {
  const { toggle, isOpen, isDesktop } = useAppStore((state) => state.sidebar);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-8">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Toggle Button for Desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="hidden lg:flex h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          title={isOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </motion.div>
        </Button>

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
      </div>
    </div>
  );
}
