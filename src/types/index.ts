export type Mood = "very_low" | "low" | "neutral" | "good" | "great";

export type Trigger =
  | "boredom"
  | "stress"
  | "loneliness"
  | "social_media"
  | "late_night"
  | "anxiety"
  | "habit"
  | "other";

export type DayStatus = "clean" | "difficult" | "setback" | "milestone" | "untracked";

export interface UserProfile {
  id: string;
  name: string;
  focusAreas: string[];
  targetDays: number;
  reminderTime: string;
  theme: "dark" | "light" | "system";
  onboardingComplete: boolean;
  createdAt: string;
  startDate: string;
  motivation?: string;
}

export interface DailyCheckIn {
  id: string;
  date: string; // yyyy-MM-dd
  mood: Mood;
  urgeLevel: number; // 1-10
  sleepHours: number;
  exercised: boolean;
  stayedInControl: boolean;
  triggers: Trigger[];
  note?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  archived?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface RelapseEvent {
  id: string;
  date: string;
  triggers: Trigger[];
  reflection: string;
  createdAt: string;
}

export interface UrgeSession {
  id: string;
  date: string;
  createdAt: string;
  urgeBefore: number;
  urgeAfter?: number;
  technique?: string;
  outcome?: "much_better" | "a_little_better" | "still_strong";
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline?: string;
  frequency: "daily" | "weekly" | "once";
  createdAt: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "consistency" | "awareness" | "habits" | "intervention" | "journaling";
  unlockedAt?: string;
}

export interface ReminderSettings {
  dailyCheckIn: { enabled: boolean; time: string };
  habitReminder: { enabled: boolean; time: string };
  eveningReflection: { enabled: boolean; time: string };
  goalReminder: { enabled: boolean; time: string };
}

export interface AppSettings {
  theme: "dark" | "light" | "system";
  reminders: ReminderSettings;
  streakProtection: boolean;
}

export interface AppData {
  version: number;
  profile: UserProfile | null;
  checkIns: DailyCheckIn[];
  habits: Habit[];
  habitLogs: HabitLog[];
  relapses: RelapseEvent[];
  urgeSessions: UrgeSession[];
  journal: JournalEntry[];
  goals: Goal[];
  achievements: Achievement[];
  settings: AppSettings;
}
