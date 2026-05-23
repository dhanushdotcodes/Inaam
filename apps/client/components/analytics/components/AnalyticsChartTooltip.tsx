"use client";

import { TaskAnalyticsDay } from "@/types";
import { formatFullDate } from "../utils";

interface ChartDataPoint extends TaskAnalyticsDay {
  points: number;
}

interface TooltipPayloadItem {
  payload: ChartDataPoint;
  value: number;
  name: string;
}

interface AnalyticsChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  dayArray: TaskAnalyticsDay[];
}

/**
 * Custom Tooltip component for the Recharts Analytics ComposedChart.
 * Prevents edge-clipping by dynamically shifting horizontal alignment at boundary points.
 */
export default function AnalyticsChartTooltip({
  active,
  payload,
  dayArray,
}: AnalyticsChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  if (!data) return null;

  const isFirst = data.date === dayArray[0]?.date;
  const isLast = data.date === dayArray[dayArray.length - 1]?.date;

  // Horizontal translation alignment percentage to keep tooltip inside bounds
  const horizontalShift = isLast ? -90 : isFirst ? -10 : -50;

  return (
    <div
      className="pointer-events-none z-30 bg-popover text-popover-foreground text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-border whitespace-nowrap flex flex-col gap-1 items-center"
      style={{
        transform: `translate(${horizontalShift}%, -100%) translateY(-12px)`,
      }}
    >
      <span className="text-[10px] text-muted-foreground">{formatFullDate(data.date)}</span>
      <div className="flex flex-col gap-0.5 items-center">
        <span className="text-primary font-bold">
          {data.completed_tasks} completed task{data.completed_tasks === 1 ? "" : "s"}
        </span>
        <span className="text-amber-500 font-extrabold text-[11px] tracking-wide flex items-center gap-1">
          +{data.points} Point{data.points === 1 ? "" : "s"}
        </span>
      </div>
      {/* Tooltip downward indicator arrow aligned exactly above the chart point */}
      <div
        className="absolute top-full border-x-4 border-x-transparent border-t-4 border-t-popover"
        style={{
          left: `${horizontalShift * -1}%`,
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}
