"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDateLabel } from "../utils";
import { TaskAnalyticsDay } from "@/types";

interface AnalyticsChartHeaderProps {
  dayArray: TaskAnalyticsDay[];
}

/**
 * Header component for the Analytics Completion Chart.
 * Displays the title, description, and the formatted date range.
 */
export default function AnalyticsChartHeader({ dayArray }: AnalyticsChartHeaderProps) {
  return (
    <CardHeader className="flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between border-b pb-4">
      <div>
        <CardTitle>Daily Completion Chart</CardTitle>
        <CardDescription>Visualizing task completion activity across the selected interval</CardDescription>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border/80">
        <Calendar className="size-4" />
        <span>
          {dayArray.length > 0 &&
            `${formatDateLabel(dayArray[0].date)} - ${formatDateLabel(dayArray[dayArray.length - 1].date)}`}
        </span>
      </div>
    </CardHeader>
  );
}
