import React from "react";
import * as Icons from "lucide-react";
import { Check } from "lucide-react";
import type { Habit, HabitLog } from "../../types";
import { todayStr } from "../../utils/date";
import { habitStreak } from "../../utils/calc";

interface HabitRowProps {
  habit: Habit;
  logs: HabitLog[];
  onToggle: () => void;
  onEdit?: () => void;
}

export default function HabitRow({ habit, logs, onToggle, onEdit }: HabitRowProps) {
  const Icon = (Icons as any)[habit.icon] || Icons.Circle;
  const completedToday = logs.some((l) => l.habitId === habit.id && l.date === todayStr() && l.completed);
  const streak = habitStreak(habit.id, logs);

  return (
    <div className="flex items-center gap-3 py-2.5 px-1 rounded-xl hover:bg-[var(--surface-2)] transition-colors group">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${habit.color}1a`, color: habit.color }}
      >
        <Icon size={17} />
      </div>
      <button onClick={onEdit} className="flex-1 min-w-0 text-left focus-ring rounded" disabled={!onEdit}>
        <p className="text-sm font-medium truncate">{habit.name}</p>
        {streak > 0 && <p className="text-xs text-[var(--muted)]">{streak} day streak</p>}
      </button>
      <button
        onClick={onToggle}
        aria-pressed={completedToday}
        aria-label={`Mark ${habit.name} ${completedToday ? "incomplete" : "complete"} for today`}
        className={`focus-ring shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
          completedToday ? "bg-[var(--primary)] border-[var(--primary)] text-black" : "border-[var(--border)] text-transparent hover:border-[var(--primary)]"
        }`}
      >
        <Check size={16} />
      </button>
    </div>
  );
}
