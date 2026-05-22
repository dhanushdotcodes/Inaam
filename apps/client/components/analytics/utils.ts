import { TaskAnalyticsResponse, PointTransaction, TaskAnalyticsDay } from "@/types";

/**
 * Formats a date string into a UTC weekday abbreviation.
 */
export const formatWeekdayLabel = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
};

/**
 * Formats a date string into a UTC month and day abbreviation.
 */
export const formatDateLabel = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};

/**
 * Formats a date string into a local long weekday and calendar date string.
 */
export const formatFullDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

/**
 * Computes analytics summary metrics (totals, averages, points, and lists)
 * based on selected days window.
 */
export const getCalculatedMetrics = (
  analyticsData: TaskAnalyticsResponse | null,
  transactions: PointTransaction[],
  days: number
) => {
  if (!analyticsData) {
    return {
      totalCompleted: 0,
      dailyAverage: "0.0",
      peakCompletions: 0,
      consistencyPercentage: "0",
      pointsEarned: 0,
      completedList: [] as PointTransaction[],
    };
  }

  const dayValues = Object.values(analyticsData.completed_data);
  const totalCompleted = dayValues.reduce((sum, d) => sum + d.completed_tasks, 0);
  const dailyAverage = (totalCompleted / days).toFixed(1);
  const peakCompletions = Math.max(...dayValues.map((d) => d.completed_tasks), 0);

  const daysWithCompletions = dayValues.filter((d) => d.completed_tasks > 0).length;
  const consistencyPercentage = ((daysWithCompletions / days) * 100).toFixed(0);

  // Calculate start limit for this window (inclusive of today)
  const startLimit = new Date();
  startLimit.setDate(startLimit.getDate() - days + 1);
  startLimit.setHours(0, 0, 0, 0);

  // Filter points earned from completed tasks in this window
  const pointsEarned = transactions
    .filter((t) => t.type === "EARNED" && new Date(t.created_at) >= startLimit)
    .reduce((sum, t) => sum + t.points, 0);

  // Get ordered list of completed tasks in this window
  const completedList = transactions
    .filter((t) => t.type === "EARNED" && new Date(t.created_at) >= startLimit)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    totalCompleted,
    dailyAverage,
    peakCompletions,
    consistencyPercentage,
    pointsEarned,
    completedList,
  };
};

/**
 * Groups earned points transactions by date key.
 */
export const getGroupedTransactions = (completedList: PointTransaction[]) => {
  const groups: Record<string, PointTransaction[]> = {};
  completedList.forEach((tx) => {
    const dateStr = new Date(tx.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(tx);
  });
  return groups;
};

/**
 * Formats transaction date group headers into relative dates (Today, Yesterday) or absolute strings.
 */
export const getGroupHeader = (dateStr: string): string => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const yesterdayStr = yesterday.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (dateStr === todayStr) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Strips task completed description prefix.
 */
export const cleanTitle = (desc: string): string => {
  return desc.replace(/^Completed task:\s*/i, "");
};

/**
 * Generates an SVG path for a Bezier curve given a set of points.
 */
export const getBezierCurve = (pts: { x: number; y: number }[]): string => {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpX1 = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
    const cpY1 = pts[i].y;
    const cpX2 = pts[i].x + (2 * (pts[i + 1].x - pts[i].x)) / 3;
    const cpY2 = pts[i + 1].y;
    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
};

/**
 * Calculates coordinates for line graph points and matching path strings.
 */
export const calculateChartPoints = (
  dayArray: TaskAnalyticsDay[],
  peakCompletions: number
) => {
  const points = dayArray.map((day, idx) => {
    const x = (idx + 0.5) * (1000 / dayArray.length);
    const y = peakCompletions > 0 
      ? 270 - (day.completed_tasks / peakCompletions) * 240 
      : 270;
    return { x, y, ...day };
  });

  const curvePath = getBezierCurve(points);
  const areaPath = points.length > 0
    ? `${curvePath} L ${points[points.length - 1].x} 270 L ${points[0].x} 270 Z`
    : "";

  return { points, curvePath, areaPath };
};
