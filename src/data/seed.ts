import { subDays, format } from "date-fns";
import type {
  AppData,
  DailyCheckIn,
  Habit,
  HabitLog,
  RelapseEvent,
  JournalEntry,
  Goal,
  Mood,
  Trigger,
} from "../types";
import { DEFAULT_HABITS } from "./defaults";
import { genId, defaultAppData } from "../services/storageService";

const MOODS: Mood[] = ["very_low", "low", "neutral", "good", "great"];
const TRIGGERS: Trigger[] = [
  "boredom",
  "stress",
  "loneliness",
  "social_media",
  "late_night",
  "anxiety",
  "habit",
  "other",
];

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDemoData(days = 78): AppData {
  const rng = mulberry32(42);
  const data = defaultAppData();
  const today = new Date();
  const startDate = format(subDays(today, days - 1), "yyyy-MM-dd");

  data.profile = {
    id: genId(),
    name: "Alex",
    focusAreas: ["reduce_compulsive_habits", "improve_self_control", "build_healthier_routines"],
    targetDays: 30,
    reminderTime: "20:00",
    theme: "dark",
    onboardingComplete: true,
    createdAt: new Date(subDays(today, days)).toISOString(),
    startDate,
  };

  const habits: Habit[] = DEFAULT_HABITS.map((h) => ({
    ...h,
    id: genId(),
    createdAt: new Date(subDays(today, days)).toISOString(),
  }));
  data.habits = habits;

  const checkIns: DailyCheckIn[] = [];
  const habitLogs: HabitLog[] = [];
  const relapses: RelapseEvent[] = [];
  const journal: JournalEntry[] = [];

  // planned setback days roughly every 12-18 days, skip a few tracked days randomly
  let sinceLastSetback = 0;
  const setbackDates = new Set<string>();

  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    sinceLastSetback++;
    const forceSetback = sinceLastSetback > 10 + Math.floor(rng() * 10) && rng() < 0.35;
    if (forceSetback) {
      setbackDates.add(date);
      sinceLastSetback = 0;
    }
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const skip = rng() < 0.06; // occasionally untracked day
    if (skip) continue;

    const isSetback = setbackDates.has(date);
    const urgeBase = isSetback ? 8 + Math.floor(rng() * 3) : 2 + Math.floor(rng() * 6);
    const exercised = rng() < 0.5;
    const sleepHours = Math.round((5.5 + rng() * 3.5) * 10) / 10;
    const moodIdx = isSetback
      ? Math.floor(rng() * 2)
      : Math.min(4, Math.floor(rng() * 5) + (exercised ? 1 : 0));
    const mood = MOODS[Math.min(4, moodIdx)];
    const numTriggers = isSetback ? 1 + Math.floor(rng() * 2) : rng() < 0.4 ? 1 : 0;
    const triggers: Trigger[] = [];
    for (let t = 0; t < numTriggers; t++) {
      const trig = pick(TRIGGERS, rng);
      if (!triggers.includes(trig)) triggers.push(trig);
    }

    checkIns.push({
      id: genId(),
      date,
      mood,
      urgeLevel: urgeBase,
      sleepHours,
      exercised,
      stayedInControl: !isSetback,
      triggers,
      note: undefined,
      createdAt: new Date(date).toISOString(),
    });

    if (isSetback) {
      relapses.push({
        id: genId(),
        date,
        triggers: triggers.length ? triggers : [pick(TRIGGERS, rng)],
        reflection: "Noticed the pattern building earlier in the day but didn't interrupt it in time.",
        createdAt: new Date(date).toISOString(),
      });
    }

    for (const habit of habits) {
      let completed = rng() < 0.55;
      if (habit.name === "Exercise") completed = exercised;
      if (habit.name === "Sleep") completed = sleepHours >= 7;
      habitLogs.push({
        id: genId(),
        habitId: habit.id,
        date,
        completed,
      });
    }
  }

  // journal entries every ~4 days
  const journalTags = ["progress", "trigger", "win", "reflection", "difficult_day"];
  for (let i = days - 1; i >= 0; i -= 4) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const isSetback = setbackDates.has(date);
    journal.push({
      id: genId(),
      date,
      mood: isSetback ? "low" : pick(MOODS, rng),
      title: isSetback ? "A harder day" : "Quick reflection",
      body: isSetback
        ? "Today was difficult. I noticed the urge building after a stressful afternoon. Tomorrow I want to plan something active for that time window instead."
        : "Feeling steady today. Stuck to my routine and noticed my energy was better after getting outside for a walk.",
      tags: isSetback ? ["trigger", "difficult_day"] : [pick(journalTags, rng)],
      createdAt: new Date(date).toISOString(),
      updatedAt: new Date(date).toISOString(),
    });
  }

  const goals: Goal[] = [
    {
      id: genId(),
      title: "30 days of consistency",
      description: "Check in every day for 30 days straight.",
      target: 30,
      current: Math.min(30, checkIns.length),
      frequency: "daily",
      createdAt: new Date(subDays(today, days)).toISOString(),
      completed: false,
    },
    {
      id: genId(),
      title: "Exercise 4x per week",
      description: "Move your body at least four times a week.",
      target: 4,
      current: checkIns.filter((c) => i7(c.date) && c.exercised).length,
      frequency: "weekly",
      createdAt: new Date(subDays(today, 7)).toISOString(),
      completed: false,
    },
    {
      id: genId(),
      title: "Sleep before 11 PM",
      description: "Build a consistent, earlier sleep schedule.",
      target: 20,
      current: 9,
      frequency: "daily",
      createdAt: new Date(subDays(today, days)).toISOString(),
      completed: false,
    },
  ];

  function i7(date: string) {
    return subDays(today, 7) <= new Date(date);
  }

  data.checkIns = checkIns;
  data.habitLogs = habitLogs;
  data.relapses = relapses;
  data.journal = journal;
  data.goals = goals;
  data.achievements = [];

  return data;
}
