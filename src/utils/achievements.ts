import type { AppData, Achievement } from "../types";
import { ACHIEVEMENT_DEFS } from "../data/defaults";
import { computeCurrentStreak, computeLongestStreak, totalCleanDays, triggerFrequency } from "./calc";

export function evaluateAchievements(data: AppData): Achievement[] {
  const currentStreak = Math.max(
    computeCurrentStreak(data.checkIns, data.relapses),
    computeLongestStreak(data.checkIns, data.relapses)
  );
  const clean = totalCleanDays(data.checkIns, data.relapses);
  const tracked = data.checkIns.length;
  const urgeSessions = data.urgeSessions.length;
  const triggerCount = Object.keys(triggerFrequency(data.checkIns, data.relapses)).length;
  const journalCount = data.journal.length;
  const exerciseDays = new Set(data.checkIns.filter((c) => c.exercised).map((c) => c.date)).size;

  const unlockedIds = new Set<string>();
  if (tracked >= 1) unlockedIds.add("first_step");
  if (currentStreak >= 7) unlockedIds.add("streak_7");
  if (currentStreak >= 14) unlockedIds.add("streak_14");
  if (currentStreak >= 30) unlockedIds.add("streak_30");
  if (clean >= 50) unlockedIds.add("clean_50");
  if (clean >= 100) unlockedIds.add("clean_100");
  if (tracked >= 7) unlockedIds.add("tracked_7");
  if (tracked >= 30) unlockedIds.add("tracked_30");
  if (urgeSessions >= 10) unlockedIds.add("urge_10");
  if (triggerCount >= 5) unlockedIds.add("triggers_5");
  if (journalCount >= 30) unlockedIds.add("journal_30");
  if (exerciseDays >= 7) unlockedIds.add("exercise_7");

  const existing = new Map(data.achievements.map((a) => [a.id, a]));

  return ACHIEVEMENT_DEFS.map((def) => {
    const isUnlocked = unlockedIds.has(def.id);
    const prev = existing.get(def.id);
    return {
      ...def,
      unlockedAt: isUnlocked ? prev?.unlockedAt ?? new Date().toISOString() : undefined,
    };
  });
}
