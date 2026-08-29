import { format, subDays, eachDayOfInterval } from "date-fns";
import type { DailyCheckIn, RelapseEvent, DayStatus, Trigger, HabitLog } from "../types";
import { todayStr } from "./date";

const MILESTONES = [7, 14, 21, 30, 50, 60, 90, 100, 150, 180, 365];

export function dayStatusFor(
  date: string,
  checkIns: DailyCheckIn[],
  relapses: RelapseEvent[],
  streakLengthOnDate?: number
): DayStatus {
  const relapse = relapses.find((r) => r.date === date);
  if (relapse) return "setback";

  const checkIn = checkIns.find((c) => c.date === date);
  if (!checkIn) return "untracked";

  if (!checkIn.stayedInControl) return "setback";

  if (streakLengthOnDate && MILESTONES.includes(streakLengthOnDate)) return "milestone";

  const difficult =
    checkIn.urgeLevel >= 7 || checkIn.mood === "very_low" || checkIn.mood === "low";

  return difficult ? "difficult" : "clean";
}

export function buildStatusMap(
  checkIns: DailyCheckIn[],
  relapses: RelapseEvent[]
): Record<string, DayStatus> {
  const dates = new Set<string>([...checkIns.map((c) => c.date), ...relapses.map((r) => r.date)]);
  const sorted = Array.from(dates).sort();
  const map: Record<string, DayStatus> = {};
  let running = 0;
  for (const date of sorted) {
    const relapse = relapses.find((r) => r.date === date);
    const checkIn = checkIns.find((c) => c.date === date);
    if (relapse || (checkIn && !checkIn.stayedInControl)) {
      running = 0;
      map[date] = "setback";
      continue;
    }
    if (!checkIn) {
      map[date] = "untracked";
      continue;
    }
    running += 1;
    map[date] = dayStatusFor(date, checkIns, relapses, running);
  }
  return map;
}

export function computeCurrentStreak(
  checkIns: DailyCheckIn[],
  relapses: RelapseEvent[],
  streakProtection = false
): number {
  const statusMap = buildStatusMap(checkIns, relapses);
  let streak = 0;
  let cursor = todayStr();
  let graceUsed = false;
  // walk backwards from today
  for (let i = 0; i < 3650; i++) {
    const status = statusMap[cursor];
    if (status === "clean" || status === "milestone") {
      streak += 1;
    } else if (status === "setback") {
      break;
    } else if (status === "untracked" || status === undefined) {
      if (cursor === todayStr()) {
        // today not tracked yet, don't break the streak
      } else if (streakProtection && !graceUsed) {
        // one grace day per streak is allowed to pass through without breaking it
        graceUsed = true;
      } else {
        break;
      }
    }
    cursor = format(subDays(new Date(cursor), 1), "yyyy-MM-dd");
  }
  return streak;
}

export function computeLongestStreak(checkIns: DailyCheckIn[], relapses: RelapseEvent[]): number {
  const statusMap = buildStatusMap(checkIns, relapses);
  const dates = Object.keys(statusMap).sort();
  let longest = 0;
  let current = 0;
  for (const d of dates) {
    if (statusMap[d] === "clean" || statusMap[d] === "milestone") {
      current += 1;
      longest = Math.max(longest, current);
    } else if (statusMap[d] === "setback") {
      current = 0;
    }
  }
  return longest;
}

export function totalCleanDays(checkIns: DailyCheckIn[], relapses: RelapseEvent[]): number {
  const statusMap = buildStatusMap(checkIns, relapses);
  return Object.values(statusMap).filter((s) => s === "clean" || s === "milestone").length;
}

export function trackedDays(checkIns: DailyCheckIn[]): number {
  return checkIns.length;
}

export function consistencyPct(checkIns: DailyCheckIn[], startDate: string): number {
  const days = Math.max(1, dayCountSince(startDate));
  return Math.round((checkIns.length / days) * 100);
}

export function dayCountSince(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

export function averageUrge(checkIns: DailyCheckIn[]): number {
  if (checkIns.length === 0) return 0;
  return Math.round((checkIns.reduce((s, c) => s + c.urgeLevel, 0) / checkIns.length) * 10) / 10;
}

export function averageSleep(checkIns: DailyCheckIn[]): number {
  if (checkIns.length === 0) return 0;
  return Math.round((checkIns.reduce((s, c) => s + c.sleepHours, 0) / checkIns.length) * 10) / 10;
}

export function triggerFrequency(
  checkIns: DailyCheckIn[],
  relapses: RelapseEvent[]
): Record<Trigger, number> {
  const counts: Record<string, number> = {};
  for (const c of checkIns) {
    for (const t of c.triggers) counts[t] = (counts[t] || 0) + 1;
  }
  for (const r of relapses) {
    for (const t of r.triggers) counts[t] = (counts[t] || 0) + 1;
  }
  return counts as Record<Trigger, number>;
}

export function habitCompletionRate(habitId: string, logs: HabitLog[], days = 30): number {
  const since = subDays(new Date(), days);
  const relevant = logs.filter(
    (l) => l.habitId === habitId && new Date(l.date) >= since && l.completed
  );
  return Math.round((relevant.length / days) * 100);
}

export function habitStreak(habitId: string, logs: HabitLog[]): number {
  let streak = 0;
  let cursor = todayStr();
  for (let i = 0; i < 365; i++) {
    const log = logs.find((l) => l.habitId === habitId && l.date === cursor);
    if (log?.completed) {
      streak += 1;
    } else if (cursor === todayStr()) {
      // allow today to be incomplete without breaking
    } else {
      break;
    }
    cursor = format(subDays(new Date(cursor), 1), "yyyy-MM-dd");
  }
  return streak;
}

export function last30Days(): string[] {
  return eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() }).map((d) =>
    format(d, "yyyy-MM-dd")
  );
}

export function last365Days(): string[] {
  return eachDayOfInterval({ start: subDays(new Date(), 364), end: new Date() }).map((d) =>
    format(d, "yyyy-MM-dd")
  );
}

export function moodToScore(mood: string): number {
  const map: Record<string, number> = { very_low: 1, low: 2, neutral: 3, good: 4, great: 5 };
  return map[mood] ?? 3;
}
