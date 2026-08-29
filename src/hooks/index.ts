import { useAppData } from "../lib/AppDataContext";
import {
  computeCurrentStreak,
  computeLongestStreak,
  totalCleanDays,
  trackedDays,
  consistencyPct,
} from "../utils/calc";

export function useUser() {
  const { data, saveProfile } = useAppData();
  return { profile: data.profile, saveProfile };
}

export function useCheckIns() {
  const { data, upsertCheckIn, getCheckInForDate } = useAppData();
  return { checkIns: data.checkIns, upsertCheckIn, getCheckInForDate };
}

export function useStreak() {
  const { data } = useAppData();
  const current = computeCurrentStreak(data.checkIns, data.relapses, data.settings.streakProtection);
  const longest = computeLongestStreak(data.checkIns, data.relapses);
  const clean = totalCleanDays(data.checkIns, data.relapses);
  const tracked = trackedDays(data.checkIns);
  const consistency = data.profile ? consistencyPct(data.checkIns, data.profile.startDate) : 0;
  return { current, longest, clean, tracked, consistency };
}

export function useHabits() {
  const { data, addHabit, updateHabit, deleteHabit, toggleHabitLog } = useAppData();
  return { habits: data.habits, habitLogs: data.habitLogs, addHabit, updateHabit, deleteHabit, toggleHabitLog };
}

export function useGoals() {
  const { data, addGoal, updateGoal, deleteGoal } = useAppData();
  return { goals: data.goals, addGoal, updateGoal, deleteGoal };
}

export function useJournal() {
  const { data, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppData();
  return { entries: data.journal, addJournalEntry, updateJournalEntry, deleteJournalEntry };
}

export function useAchievements() {
  const { data } = useAppData();
  return { achievements: data.achievements };
}

export function useUrgeSessions() {
  const { data, addUrgeSession, updateUrgeSession } = useAppData();
  return { sessions: data.urgeSessions, addUrgeSession, updateUrgeSession };
}

export function useSettings() {
  const { data, updateSettings } = useAppData();
  return { settings: data.settings, updateSettings };
}

export { useLocalStorage } from "./useLocalStorage";
