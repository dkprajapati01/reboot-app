import type { AppData } from "../types";
import { TRIGGER_LABELS } from "../data/defaults";

export function generateInsights(data: AppData): string[] {
  const insights: string[] = [];
  const { checkIns } = data;

  if (checkIns.length < 5) {
    return ["Keep checking in daily — insights become more accurate with more data."];
  }

  // Most common trigger
  const triggerCounts: Record<string, number> = {};
  for (const c of checkIns) for (const t of c.triggers) triggerCounts[t] = (triggerCounts[t] || 0) + 1;
  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
  if (topTrigger && topTrigger[1] >= 3) {
    insights.push(`Your most common trigger is ${TRIGGER_LABELS[topTrigger[0] as keyof typeof TRIGGER_LABELS].toLowerCase()}.`);
  }

  // Late night urge levels
  const lateNight = checkIns.filter((c) => c.triggers.includes("late_night"));
  const others = checkIns.filter((c) => !c.triggers.includes("late_night"));
  if (lateNight.length >= 3 && others.length >= 3) {
    const avgLate = lateNight.reduce((s, c) => s + c.urgeLevel, 0) / lateNight.length;
    const avgOther = others.reduce((s, c) => s + c.urgeLevel, 0) / others.length;
    if (avgLate > avgOther + 0.5) {
      insights.push("Your urge levels tend to be higher late at night.");
    }
  }

  // Exercise vs urge
  const exercised = checkIns.filter((c) => c.exercised);
  const notExercised = checkIns.filter((c) => !c.exercised);
  if (exercised.length >= 3 && notExercised.length >= 3) {
    const avgEx = exercised.reduce((s, c) => s + c.urgeLevel, 0) / exercised.length;
    const avgNoEx = notExercised.reduce((s, c) => s + c.urgeLevel, 0) / notExercised.length;
    if (avgEx < avgNoEx - 0.4) {
      insights.push("Your average urge is lower on days you exercise.");
    }
  }

  // Sleep vs urge
  const goodSleep = checkIns.filter((c) => c.sleepHours >= 7);
  const poorSleep = checkIns.filter((c) => c.sleepHours < 6);
  if (goodSleep.length >= 3 && poorSleep.length >= 3) {
    const avgGood = goodSleep.reduce((s, c) => s + c.urgeLevel, 0) / goodSleep.length;
    const avgPoor = poorSleep.reduce((s, c) => s + c.urgeLevel, 0) / poorSleep.length;
    if (avgPoor > avgGood + 0.5) {
      insights.push("Urge levels tend to be higher on days with less sleep.");
    }
  }

  // Mood trend recent vs prior
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-7);
  const prior = sorted.slice(-14, -7);
  if (recent.length >= 4 && prior.length >= 4) {
    const moodScore = (m: string) => ({ very_low: 1, low: 2, neutral: 3, good: 4, great: 5 }[m] ?? 3);
    const avgRecent = recent.reduce((s, c) => s + moodScore(c.mood), 0) / recent.length;
    const avgPrior = prior.reduce((s, c) => s + moodScore(c.mood), 0) / prior.length;
    if (avgRecent > avgPrior + 0.4) insights.push("Your mood has been trending upward over the past week.");
    else if (avgRecent < avgPrior - 0.4) insights.push("Your mood has dipped slightly over the past week — consider revisiting your routines.");
  }

  if (insights.length === 0) {
    insights.push("No strong patterns yet — keep tracking to unlock more personalized insights.");
  }

  return insights.slice(0, 5);
}
