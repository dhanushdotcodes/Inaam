"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TaskAnalyticsDay } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatWeekdayLabel,
  formatDateLabel,
  formatFullDate,
  calculateChartPoints,
} from "../utils";

interface AnalyticsChartProps {
  dayArray: TaskAnalyticsDay[];
  peakCompletions: number;
  days: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}

export default function AnalyticsChart({
  dayArray,
  peakCompletions,
  days,
  hoveredIndex,
  setHoveredIndex,
}: AnalyticsChartProps) {
  const { points, curvePath, areaPath } = calculateChartPoints(dayArray, peakCompletions);

  return (
    <Card className="col-span-4 overflow-visible bg-card/40 backdrop-blur-md border-border/80 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
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
      <CardContent className="pt-6">
        {/* Horizontal scroll wrapper with custom scrollbar styling */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/15 scrollbar-track-transparent">
          {/* Minimum width constraints to maintain readability on smaller screens */}
          <div className="relative flex flex-col pt-12 min-w-200 overflow-visible">
            {/* Grid Lines behind chart */}
            <div className="absolute inset-x-0 top-12 bottom-8 flex flex-col justify-between pointer-events-none z-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-border/40" />
              ))}
            </div>

            {/* SVG Bezier-Curve Trend Line Overlay */}
            <svg
              className="absolute left-4 right-4 top-12 h-72 pointer-events-none z-20 overflow-visible"
              style={{ width: "calc(100% - 32px)" }}
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
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

              {/* Area path */}
              {points.length > 0 && (
                <path d={areaPath} fill="url(#area-gradient)" className="transition-all duration-300" />
              )}

              {/* Curve Path */}
              {points.length > 0 && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke="url(#line-gradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#chart-glow)"
                  className="transition-all duration-300"
                />
              )}

              {/* Curve Joint Points with custom hovers */}
              {points.map((p, idx) => (
                <g key={idx}>
                  {/* Glow halo on hover */}
                  {hoveredIndex === idx && (
                    <circle cx={p.x} cy={p.y} r="11" fill="var(--primary)" opacity="0.3" className="animate-ping" />
                  )}
                  {/* Interactive Dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === idx ? "6.5" : "4"}
                    fill={hoveredIndex === idx ? "var(--primary)" : "var(--card)"}
                    stroke="var(--primary)"
                    strokeWidth={hoveredIndex === idx ? "2.5" : "1.8"}
                    className="transition-all duration-200"
                  />
                </g>
              ))}
            </svg>

            {/* Tooltip positioned directly near the hovered point on the line graph */}
            <div
              className="absolute left-4 right-4 top-12 h-72 pointer-events-none z-30 overflow-visible"
              style={{ width: "calc(100% - 32px)" }}
            >
              <AnimatePresence>
                {hoveredIndex !== null && points[hoveredIndex] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute pointer-events-none z-30 bg-popover text-popover-foreground text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-border whitespace-nowrap flex flex-col gap-0.5 items-center"
                    style={{
                      left: `${((hoveredIndex + 0.5) / dayArray.length) * 100}%`,
                      top: `${(points[hoveredIndex].y / 300) * 288}px`,
                      transform: "translate(-50%, -100%) translateY(-12px)",
                    }}
                  >
                    <span className="text-[10px] text-muted-foreground">{formatFullDate(points[hoveredIndex].date)}</span>
                    <span className="text-primary">
                      {points[hoveredIndex].completed_tasks} completed task
                      {points[hoveredIndex].completed_tasks === 1 ? "" : "s"}
                    </span>
                    {/* Tooltip downward indicator arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-popover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chart Bars Container */}
            <div className="flex items-end justify-between gap-1 sm:gap-2 md:gap-3 h-72 px-4 pb-2 z-10">
              {dayArray.map((day, idx) => {
                const heightPercent = peakCompletions > 0 ? (day.completed_tasks / peakCompletions) * 100 : 0;

                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Active Glow behind bars */}
                    {day.completed_tasks > 0 && (
                      <div
                        className={cn(
                          "absolute bottom-0 w-full bg-primary/10 blur-sm rounded-t-lg pointer-events-none transition-all duration-300",
                          hoveredIndex === idx ? "opacity-40" : "opacity-20"
                        )}
                        style={{ height: `${heightPercent}%` }}
                      />
                    )}

                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPercent, 3)}%` }}
                      transition={{ type: "spring", stiffness: 90, damping: 14, delay: idx * 0.015 }}
                      className={cn(
                        "w-full rounded-t-md transition-all duration-300 cursor-pointer relative overflow-hidden",
                        day.completed_tasks > 0
                          ? hoveredIndex === idx
                            ? "bg-primary/45"
                            : "bg-primary/25"
                          : "bg-muted/40 hover:bg-muted-foreground/15"
                      )}
                    >
                      {/* Reflection overlay */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/5 to-transparent" />
                    </motion.div>

                    {/* X-Axis Label */}
                    <span
                      className={cn(
                        "text-[9px] sm:text-[10px] mt-3 font-semibold select-none text-center truncate w-full transition-colors duration-200",
                        hoveredIndex === idx ? "text-primary font-bold" : "text-muted-foreground"
                      )}
                    >
                      {days === 7 ? formatWeekdayLabel(day.date) : day.date.split("-")[2]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
