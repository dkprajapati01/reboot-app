import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type {
  AppData,
  UserProfile,
  DailyCheckIn,
  Habit,
  HabitLog,
  RelapseEvent,
  UrgeSession,
  JournalEntry,
  Goal,
  AppSettings,
} from "../types";
import { getItem, setItem, genId, clearAppData as clearStorage } from "../services/storageService";
import { generateDemoData } from "../data/seed";
import { evaluateAchievements } from "../utils/achievements";
import { DEFAULT_HABITS } from "../data/defaults";
import { todayStr } from "../utils/date";

interface AppDataContextValue {
  data: AppData;
  loading: boolean;
  userId: string;
  saveProfile: (profile: UserProfile) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  upsertCheckIn: (checkIn: Omit<DailyCheckIn, "id" | "createdAt"> & { id?: string }) => void;
  getCheckInForDate: (date: string) => DailyCheckIn | undefined;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitLog: (habitId: string, date: string) => void;
  recordRelapse: (relapse: Omit<RelapseEvent, "id" | "createdAt">) => void;
  addUrgeSession: (session: Omit<UrgeSession, "id" | "createdAt">) => string;
  updateUrgeSession: (id: string, patch: Partial<UrgeSession>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  updateJournalEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "completed">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  ensureDefaultHabits: () => void;
  loadDemoData: () => void;
  resetAllData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => getItem(userId));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(getItem(userId));
  }, [userId]);

  const persist = useCallback(
    (updater: (prev: AppData) => AppData) => {
      setData((prev) => {
        const next = updater(prev);
        const withAchievements = { ...next, achievements: evaluateAchievements(next) };
        setItem(userId, withAchievements);
        return withAchievements;
      });
    },
    [userId]
  );

  useEffect(() => {
    const theme = data.settings.theme;
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    document.documentElement.setAttribute("data-theme", resolved);
  }, [data.settings.theme]);

  const saveProfile = useCallback(
    (profile: UserProfile) => {
      persist((prev) => ({ ...prev, profile }));
    },
    [persist]
  );

  const updateSettings = useCallback(
    (settings: Partial<AppSettings>) => {
      persist((prev) => ({ ...prev, settings: { ...prev.settings, ...settings } }));
    },
    [persist]
  );

  const upsertCheckIn = useCallback(
    (checkIn: Omit<DailyCheckIn, "id" | "createdAt"> & { id?: string }) => {
      persist((prev) => {
        const existingIdx = prev.checkIns.findIndex((c) => c.date === checkIn.date);
        const record: DailyCheckIn = {
          id: checkIn.id ?? prev.checkIns[existingIdx]?.id ?? genId(),
          createdAt: prev.checkIns[existingIdx]?.createdAt ?? new Date().toISOString(),
          date: checkIn.date,
          mood: checkIn.mood,
          urgeLevel: checkIn.urgeLevel,
          sleepHours: checkIn.sleepHours,
          exercised: checkIn.exercised,
          stayedInControl: checkIn.stayedInControl,
          triggers: checkIn.triggers,
          note: checkIn.note,
        };
        const checkIns = [...prev.checkIns];
        if (existingIdx >= 0) checkIns[existingIdx] = record;
        else checkIns.push(record);
        return { ...prev, checkIns };
      });
    },
    [persist]
  );

  const getCheckInForDate = useCallback(
    (date: string) => data.checkIns.find((c) => c.date === date),
    [data.checkIns]
  );

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "createdAt">) => {
      persist((prev) => ({
        ...prev,
        habits: [...prev.habits, { ...habit, id: genId(), createdAt: new Date().toISOString() }],
      }));
    },
    [persist]
  );

  const updateHabit = useCallback(
    (id: string, patch: Partial<Habit>) => {
      persist((prev) => ({
        ...prev,
        habits: prev.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
      }));
    },
    [persist]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        habits: prev.habits.filter((h) => h.id !== id),
        habitLogs: prev.habitLogs.filter((l) => l.habitId !== id),
      }));
    },
    [persist]
  );

  const toggleHabitLog = useCallback(
    (habitId: string, date: string) => {
      persist((prev) => {
        const idx = prev.habitLogs.findIndex((l) => l.habitId === habitId && l.date === date);
        const logs = [...prev.habitLogs];
        if (idx >= 0) {
          logs[idx] = { ...logs[idx], completed: !logs[idx].completed };
        } else {
          logs.push({ id: genId(), habitId, date, completed: true });
        }
        return { ...prev, habitLogs: logs };
      });
    },
    [persist]
  );

  const recordRelapse = useCallback(
    (relapse: Omit<RelapseEvent, "id" | "createdAt">) => {
      persist((prev) => {
        const relapses = [...prev.relapses.filter((r) => r.date !== relapse.date), { ...relapse, id: genId(), createdAt: new Date().toISOString() }];
        const checkIns = prev.checkIns.map((c) =>
          c.date === relapse.date ? { ...c, stayedInControl: false, triggers: relapse.triggers } : c
        );
        if (!checkIns.find((c) => c.date === relapse.date)) {
          checkIns.push({
            id: genId(),
            date: relapse.date,
            mood: "low",
            urgeLevel: 8,
            sleepHours: 7,
            exercised: false,
            stayedInControl: false,
            triggers: relapse.triggers,
            createdAt: new Date().toISOString(),
          });
        }
        return { ...prev, relapses, checkIns };
      });
    },
    [persist]
  );

  const addUrgeSession = useCallback(
    (session: Omit<UrgeSession, "id" | "createdAt">) => {
      const id = genId();
      persist((prev) => ({
        ...prev,
        urgeSessions: [...prev.urgeSessions, { ...session, id, createdAt: new Date().toISOString() }],
      }));
      return id;
    },
    [persist]
  );

  const updateUrgeSession = useCallback(
    (id: string, patch: Partial<UrgeSession>) => {
      persist((prev) => ({
        ...prev,
        urgeSessions: prev.urgeSessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      }));
    },
    [persist]
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
      persist((prev) => ({
        ...prev,
        journal: [
          { ...entry, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ...prev.journal,
        ],
      }));
    },
    [persist]
  );

  const updateJournalEntry = useCallback(
    (id: string, patch: Partial<JournalEntry>) => {
      persist((prev) => ({
        ...prev,
        journal: prev.journal.map((j) =>
          j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j
        ),
      }));
    },
    [persist]
  );

  const deleteJournalEntry = useCallback(
    (id: string) => {
      persist((prev) => ({ ...prev, journal: prev.journal.filter((j) => j.id !== id) }));
    },
    [persist]
  );

  const addGoal = useCallback(
    (goal: Omit<Goal, "id" | "createdAt" | "completed">) => {
      persist((prev) => ({
        ...prev,
        goals: [...prev.goals, { ...goal, id: genId(), createdAt: new Date().toISOString(), completed: false }],
      }));
    },
    [persist]
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Goal>) => {
      persist((prev) => ({
        ...prev,
        goals: prev.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
    },
    [persist]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      persist((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
    },
    [persist]
  );

  const ensureDefaultHabits = useCallback(() => {
    persist((prev) => {
      if (prev.habits.length > 0) return prev;
      const habits: Habit[] = DEFAULT_HABITS.map((h) => ({
        ...h,
        id: genId(),
        createdAt: new Date().toISOString(),
      }));
      return { ...prev, habits };
    });
  }, [persist]);

  const loadDemoData = useCallback(() => {
    setLoading(true);
    const demo = generateDemoData(78);
    const withAchievements = { ...demo, achievements: evaluateAchievements(demo) };
    setItem(userId, withAchievements);
    setData(withAchievements);
    setLoading(false);
  }, [userId]);

  const resetAllData = useCallback(() => {
    const fresh = clearStorage(userId);
    setData(fresh);
  }, [userId]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,
      loading,
      userId,
      saveProfile,
      updateSettings,
      upsertCheckIn,
      getCheckInForDate,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitLog,
      recordRelapse,
      addUrgeSession,
      updateUrgeSession,
      addJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      addGoal,
      updateGoal,
      deleteGoal,
      ensureDefaultHabits,
      loadDemoData,
      resetAllData,
    }),
    [
      data,
      loading,
      userId,
      saveProfile,
      updateSettings,
      upsertCheckIn,
      getCheckInForDate,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitLog,
      recordRelapse,
      addUrgeSession,
      updateUrgeSession,
      addJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      addGoal,
      updateGoal,
      deleteGoal,
      ensureDefaultHabits,
      loadDemoData,
      resetAllData,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export { todayStr };
