"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Zap, Award } from "lucide-react";
import { motion, Variants } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsStatsProps {
  totalCompleted: number;
  dailyAverage: string;
  peakCompletions: number;
  pointsEarned: number;
  days: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24,
    },
  },
};

export default function AnalyticsStats({
  totalCompleted,
  dailyAverage,
  peakCompletions,
  pointsEarned,
  days,
}: AnalyticsStatsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={cardVariants} whileHover={{ y: -4 }}>
        <Card className="bg-card/40 backdrop-blur-md border-border/80 shadow-md h-full">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Total Completed</p>
                <h3 className="text-3xl font-brand mt-1 text-foreground">{totalCompleted}</h3>
              </div>
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Tasks finished in last {days} days</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} whileHover={{ y: -4 }}>
        <Card className="bg-card/40 backdrop-blur-md border-border/80 shadow-md h-full">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Daily Average</p>
                <h3 className="text-3xl font-brand mt-1 text-foreground">{dailyAverage}</h3>
              </div>
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Completed tasks per day</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} whileHover={{ y: -4 }}>
        <Card className="bg-card/40 backdrop-blur-md border-border/80 shadow-md h-full">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Peak Output</p>
                <h3 className="text-3xl font-brand mt-1 text-foreground">{peakCompletions}</h3>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                <Zap className="size-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Most tasks completed in one day</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} whileHover={{ y: -4 }}>
        <Card className="bg-card/40 backdrop-blur-md border-border/80 shadow-md h-full">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Points Earned</p>
                <h3 className="text-3xl font-brand mt-1 text-primary">+{pointsEarned}</h3>
              </div>
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Award className="size-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Task rewards earned in period</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
