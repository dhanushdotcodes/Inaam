"use client";

import React from "react";
import { TaskAnalyticsDay, PointTransaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import AnalyticsChartHeader from "./AnalyticsChartHeader";
import AnalyticsChartTooltip from "./AnalyticsChartTooltip";
import AnalyticsChartGraph from "./AnalyticsChartGraph";

interface AnalyticsChartProps {
  dayArray: TaskAnalyticsDay[];
  peakCompletions: number;
  days: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  transactions?: PointTransaction[];
}

/**
 * Orchestrator component for the Productivity Analytics Chart.
 * Maps completion statistics and transaction reward points into a combined
 * dataset, and renders modular header, graph, and tooltip sub-components.
 */
export default function AnalyticsChart({
  dayArray,
  peakCompletions,
  days,
  hoveredIndex,
  setHoveredIndex,
  transactions = [],
}: AnalyticsChartProps) {
  // Sum EARNED points for each date
  const pointsByDate = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === "EARNED")
      .reduce((acc, t) => {
        // ISO string split gets date YYYY-MM-DD
        const dateStr = t.created_at.split("T")[0];
        acc[dateStr] = (acc[dateStr] || 0) + t.points;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  // Combine day completion data with calculated daily points
  const chartData = React.useMemo(() => {
    return dayArray.map((day) => ({
      ...day,
      points: pointsByDate[day.date] || 0,
    }));
  }, [dayArray, pointsByDate]);

  return (
    <Card className="col-span-4 overflow-visible bg-card/40 backdrop-blur-md border-border/80 shadow-lg">
      <AnalyticsChartHeader dayArray={dayArray} />
      <CardContent className="pt-6">
        <AnalyticsChartGraph
          chartData={chartData}
          peakCompletions={peakCompletions}
          days={days}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        >
          <AnalyticsChartTooltip dayArray={dayArray} />
        </AnalyticsChartGraph>
      </CardContent>
    </Card>
  );
}
