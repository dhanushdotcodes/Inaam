"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TaskAnalyticsDay } from "@/types";
import { cn } from "@/lib/utils";
import { formatWeekdayLabel } from "../utils";

interface ChartDataPoint extends TaskAnalyticsDay {
  points: number;
}

interface AnalyticsChartGraphProps {
  chartData: ChartDataPoint[];
  days: number;
  peakCompletions: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  children?: React.ReactElement; // Typed as ReactElement specifically for Recharts Tooltip compatibility
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  index?: number;
  hoveredIndex: number | null;
  days: number;
}

// Custom interactive tick renderer for XAxis declared outside render scope
const CustomXAxisTick = (props: CustomXAxisTickProps) => {
  const { x = 0, y = 0, payload, index = 0, hoveredIndex, days } = props;
  if (!payload) return null;
  const isHovered = hoveredIndex === index;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill={isHovered ? "var(--primary)" : "var(--muted-foreground)"}
        className={cn(
          "text-[10px] font-semibold transition-colors duration-200 select-none",
          isHovered && "font-bold"
        )}
      >
        {days === 7 ? formatWeekdayLabel(payload.value) : payload.value.split("-")[2]}
      </text>
    </g>
  );
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  hoveredIndex: number | null;
}

// Custom interactive dot renderer for Line chart declared outside render scope
const CustomDot = (props: CustomDotProps) => {
  const { cx = 0, cy = 0, index = 0, hoveredIndex } = props;
  const isHovered = hoveredIndex === index;
  return (
    <g key={`dot-${index}`}>
      {isHovered && (
        <circle
          cx={cx}
          cy={cy}
          r={11}
          fill="var(--primary)"
          opacity="0.3"
          className="animate-ping"
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 6.5 : 4}
        fill={isHovered ? "var(--primary)" : "var(--card)"}
        stroke="var(--primary)"
        strokeWidth={isHovered ? 2.5 : 1.8}
        className="transition-all duration-200"
      />
    </g>
  );
};

/**
 * Main chart graph area rendering via Recharts.
 * Integrates Area, Line, and Bar components with custom ticks and dots.
 */
export default function AnalyticsChartGraph({
  chartData,
  days,
  peakCompletions,
  hoveredIndex,
  setHoveredIndex,
  children,
}: AnalyticsChartGraphProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/15 scrollbar-track-transparent">
      {/* Minimum width constraints to maintain readability on smaller screens */}
      <div className="relative h-[320px] min-w-[800px] overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 16, left: 16, bottom: 10 }}
            onMouseMove={(state) => {
              if (state && typeof state.activeTooltipIndex === "number") {
                setHoveredIndex(state.activeTooltipIndex);
              } else {
                setHoveredIndex(null);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              {/* Glow Filter */}
              <filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Stroke Gradient */}
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>

              {/* Area Fill Gradient */}
              <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="0"
              opacity={0.4}
            />

            {/* X and Y Axes */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={<CustomXAxisTick hoveredIndex={hoveredIndex} days={days} />}
              interval={0}
            />
            <YAxis
              hide
              domain={[0, Math.max(peakCompletions, 4)]}
            />

            {/* Tooltip Overlay */}
            <Tooltip
              content={children}
              cursor={false}
              isAnimationActive={false}
            />

            {/* 1. Area Path Gradient Under Flow */}
            <Area
              type="monotone"
              dataKey="completed_tasks"
              fill="url(#area-gradient)"
              stroke="none"
              isAnimationActive={true}
            />

            {/* 2. Completion Bars Chart */}
            <Bar
              dataKey="completed_tasks"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="var(--primary)"
                  fillOpacity={hoveredIndex === index ? 0.45 : 0.25}
                  className="transition-colors duration-300 cursor-pointer"
                />
              ))}
            </Bar>

            {/* 3. Curve Trend Line */}
            <Line
              type="monotone"
              dataKey="completed_tasks"
              stroke="url(#line-gradient)"
              strokeWidth={3.5}
              dot={<CustomDot hoveredIndex={hoveredIndex} />}
              activeDot={false}
              filter="url(#chart-glow)"
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
