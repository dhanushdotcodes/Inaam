"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getTaskAnalytics, getTransactions } from "@/lib/api";
import { TaskAnalyticsResponse, PointTransaction } from "@/types";
import PageShell, { PageContent } from "@/components/layout/PageShell";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardLoader from "@/components/shared/DashboardLoader";
import StatusError from "@/components/shared/StatusError";
import { cn } from "@/lib/utils";
import { getCalculatedMetrics } from "./utils";
import AnalyticsStats from "./components/AnalyticsStats";
import AnalyticsChart from "./components/AnalyticsChart";

export default function AnalyticsDashboard() {
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<TaskAnalyticsResponse | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Incrementing retryKey re-triggers the effect without moving fetch logic outside.
  const [retryKey, setRetryKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [analyticsRes, transactionsRes] = await Promise.all([
          getTaskAnalytics(days),
          getTransactions(),
        ]);
        if (!cancelled) {
          setAnalyticsData(analyticsRes);
          setTransactions(transactionsRes);
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to fetch analytics statistics.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    // Cleanup: prevent stale state updates on fast day-tab switches.
    return () => { cancelled = true; };
  }, [days, retryKey]);

  // Convert map to ordered day array
  const dayArray = analyticsData
    ? Object.keys(analyticsData.completed_data)
        .sort((a, b) => {
          const numA = parseInt(a.replace("day_", ""), 10);
          const numB = parseInt(b.replace("day_", ""), 10);
          return numA - numB;
        })
        .map((key) => analyticsData.completed_data[key])
    : [];

  const { totalCompleted, dailyAverage, peakCompletions, pointsEarned } =
    getCalculatedMetrics(analyticsData, transactions, days);

  return (
    <PageShell>
      <DashboardHeader
        title="Analytics"
        description="Track your daily completion streaks, points earned, and productivity breakdown."
      >
        {/* Day range toggle — smooth sliding capsule via Framer Motion layoutId */}
        <div className="relative flex bg-muted/60 backdrop-blur-md p-1 rounded-2xl items-center border border-border/80 select-none">
          {([7, 14, 30] as const).map((r) => (
            <button
              key={r}
              id={`analytics-tab-${r}`}
              onClick={() => setDays(r)}
              className={cn(
                "relative z-10 px-4 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-colors duration-300",
                days === r
                  ? "text-primary font-extrabold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {days === r && (
                <motion.div
                  layoutId="activeRangeTab"
                  className="absolute inset-0 bg-card rounded-xl shadow-sm border border-border/40 -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {r} Days
            </button>
          ))}
        </div>
      </DashboardHeader>

      <PageContent className="space-y-8">
        {loading && (
          <div className="min-h-96 flex items-center justify-center">
            <DashboardLoader message="Fetching your productivity statistics..." />
          </div>
        )}

        {!loading && error && (
          <StatusError error={error} onRetry={() => setRetryKey((k) => k + 1)} />
        )}

        {!loading && !error && analyticsData && (
          <>
            <AnalyticsStats
              totalCompleted={totalCompleted}
              dailyAverage={dailyAverage}
              peakCompletions={peakCompletions}
              pointsEarned={pointsEarned}
              days={days}
            />

            <AnalyticsChart
              dayArray={dayArray}
              peakCompletions={peakCompletions}
              days={days}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          </>
        )}
      </PageContent>
    </PageShell>
  );
}
