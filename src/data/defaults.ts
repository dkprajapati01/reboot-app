import type { Achievement, Habit, Trigger, Mood } from "../types";

export const DEFAULT_HABITS: Omit<Habit, "id" | "createdAt">[] = [
  { name: "Exercise", icon: "Dumbbell", color: "#22C55E" },
  { name: "Meditation", icon: "BrainCircuit", color: "#3B82F6" },
  { name: "Reading", icon: "BookOpen", color: "#F59E0B" },
  { name: "Water", icon: "Droplets", color: "#38BDF8" },
  { name: "Sleep", icon: "Moon", color: "#A78BFA" },
  { name: "Morning sunlight", icon: "Sunrise", color: "#FB923C" },
  { name: "Walking", icon: "Footprints", color: "#34D399" },
  { name: "Reduced screen time", icon: "SmartphoneOff", color: "#F472B6" },
];

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first_step", title: "First Step", description: "Completed your first check-in.", icon: "Footprints", category: "consistency" },
  { id: "streak_7", title: "7 Day Streak", description: "Stayed consistent for 7 days.", icon: "Flame", category: "consistency" },
  { id: "streak_14", title: "14 Day Streak", description: "Two weeks of consistency.", icon: "Flame", category: "consistency" },
  { id: "streak_30", title: "30 Day Streak", description: "A full month of progress.", icon: "Flame", category: "consistency" },
  { id: "clean_50", title: "50 Clean Days", description: "Reached 50 total clean days.", icon: "ShieldCheck", category: "consistency" },
  { id: "clean_100", title: "100 Clean Days", description: "Reached 100 total clean days.", icon: "ShieldCheck", category: "consistency" },
  { id: "tracked_7", title: "7 Days Tracked", description: "Logged a check-in 7 times.", icon: "CalendarCheck", category: "awareness" },
  { id: "tracked_30", title: "30 Days Tracked", description: "Logged a check-in 30 times.", icon: "CalendarCheck", category: "awareness" },
  { id: "urge_10", title: "10 Urge Interventions", description: "Used Urge Mode 10 times.", icon: "HandMetal", category: "intervention" },
  { id: "triggers_5", title: "5 Triggers Identified", description: "Identified 5 distinct triggers.", icon: "Search", category: "awareness" },
  { id: "journal_30", title: "30 Journal Entries", description: "Reflected in your journal 30 times.", icon: "NotebookPen", category: "journaling" },
  { id: "exercise_7", title: "7 Exercise Days", description: "Exercised on 7 different days.", icon: "Dumbbell", category: "habits" },
];

export const TRIGGER_LABELS: Record<Trigger, string> = {
  boredom: "Boredom",
  stress: "Stress",
  loneliness: "Loneliness",
  social_media: "Social media",
  late_night: "Late night",
  anxiety: "Anxiety",
  habit: "Habit",
  other: "Other",
};

export const MOOD_LABELS: Record<Mood, string> = {
  very_low: "Very low",
  low: "Low",
  neutral: "Neutral",
  good: "Good",
  great: "Great",
};

export const MOOD_EMOJI: Record<Mood, string> = {
  very_low: "😞",
  low: "😕",
  neutral: "😐",
  good: "🙂",
  great: "😄",
};

export const FOCUS_OPTIONS = [
  { id: "reduce_compulsive_habits", label: "Reduce compulsive habits" },
  { id: "improve_self_control", label: "Improve self-control" },
  { id: "reduce_pornography_use", label: "Reduce pornography use" },
  { id: "improve_focus", label: "Improve focus" },
  { id: "build_healthier_routines", label: "Build healthier routines" },
  { id: "track_consistency", label: "Track consistency" },
];

export const FOCUS_LABELS: Record<string, string> = Object.fromEntries(
  FOCUS_OPTIONS.map((f) => [f.id, f.label])
);

export const MOTIVATION_PROMPTS = [
  "Progress is built through consistency, not perfection.",
  "One difficult moment doesn't erase the progress you've already made.",
  "Notice the pattern. Change the response.",
  "Small, steady steps outlast bursts of willpower.",
  "You're not starting over — you're continuing.",
  "Focus on today. That's the only day you can act on.",
];

export interface Resource {
  category: string;
  title: string;
  body: string;
}

export const RESOURCES: Resource[] = [
  {
    category: "Urge Management",
    title: "The 10-minute rule",
    body: "Urges are temporary and usually peak within a few minutes. Committing to wait just 10 minutes before acting on an urge gives the feeling time to pass and gives you a chance to choose a different response.",
  },
  {
    category: "Urge Management",
    title: "Change your environment",
    body: "Physically moving to a different room, going outside, or changing what's in front of you can interrupt a pattern before it builds momentum.",
  },
  {
    category: "Habit Building",
    title: "Stack small habits",
    body: "Attach a new habit to something you already do every day, like stretching right after you brush your teeth. Small, consistent actions compound over time.",
  },
  {
    category: "Habit Building",
    title: "Track the process, not just the outcome",
    body: "Logging whether you showed up matters more than being perfect. Consistency is built through repetition, not through flawless days.",
  },
  {
    category: "Sleep",
    title: "Protect your wind-down window",
    body: "The 30–60 minutes before bed set the tone for sleep quality. Dimming lights and stepping away from screens can make falling asleep easier.",
  },
  {
    category: "Focus",
    title: "Single-tasking beats multitasking",
    body: "Attention is a limited resource. Working on one thing at a time, even for short blocks, tends to produce better focus than switching between tasks.",
  },
  {
    category: "Stress",
    title: "Name what you're feeling",
    body: "Putting a specific word to an emotion — stressed, anxious, restless — can reduce its intensity and make it easier to respond thoughtfully.",
  },
  {
    category: "Digital Wellbeing",
    title: "Design friction into distractions",
    body: "Small barriers, like logging out of an app or leaving your phone in another room, reduce impulsive use without requiring constant willpower.",
  },
  {
    category: "Self Reflection",
    title: "Look for patterns, not verdicts",
    body: "When you notice a difficult day, ask what was happening beforehand instead of judging yourself. Patterns are useful information, not evidence of failure.",
  },
];

export const RESPONSIBLE_USE_NOTE =
  "If compulsive behavior is causing significant distress or interfering with daily life, consider speaking with a qualified therapist or healthcare provider. This app is a self-tracking tool, not a substitute for professional support.";
