import React, { useState } from "react";
import { Check } from "lucide-react";
import Button from "../ui/Button";
import { MOOD_EMOJI, MOOD_LABELS, TRIGGER_LABELS } from "../../data/defaults";
import type { Mood, Trigger, DailyCheckIn } from "../../types";
import { todayStr } from "../../utils/date";
import { useCheckIns } from "../../hooks";
import { useToast } from "../ui/Toast";

const MOODS: Mood[] = ["very_low", "low", "neutral", "good", "great"];
const TRIGGERS: Trigger[] = ["boredom", "stress", "loneliness", "social_media", "late_night", "anxiety", "habit", "other"];

export default function CheckInForm({ onDone, date = todayStr() }: { onDone?: () => void; date?: string }) {
  const { upsertCheckIn, getCheckInForDate } = useCheckIns();
  const { showToast } = useToast();
  const existing = getCheckInForDate(date);

  const [mood, setMood] = useState<Mood>(existing?.mood ?? "neutral");
  const [urgeLevel, setUrgeLevel] = useState(existing?.urgeLevel ?? 3);
  const [sleepHours, setSleepHours] = useState(existing?.sleepHours ?? 7);
  const [exercised, setExercised] = useState(existing?.exercised ?? false);
  const [stayedInControl, setStayedInControl] = useState<boolean>(existing?.stayedInControl ?? true);
  const [triggers, setTriggers] = useState<Trigger[]>(existing?.triggers ?? []);
  const [note, setNote] = useState(existing?.note ?? "");
  const [submitted, setSubmitted] = useState(false);

  function toggleTrigger(t: Trigger) {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const record: Omit<DailyCheckIn, "id" | "createdAt"> = {
      date,
      mood,
      urgeLevel,
      sleepHours,
      exercised,
      stayedInControl,
      triggers,
      note: note.trim() || undefined,
    };
    upsertCheckIn(record);
    setSubmitted(true);
    showToast("Today is logged ✓", "success");
    setTimeout(() => {
      onDone?.();
    }, 900);
  }

  if (submitted) {
    return (
      <div className="text-center py-10 animate-pop">
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mx-auto mb-5">
          <Check size={30} />
        </div>
        <p className="text-lg font-semibold">Today is logged ✓</p>
        <p className="text-sm text-[var(--muted)] mt-1.5">Focus on today. Progress is built one day at a time.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-medium mb-3">How are you feeling?</legend>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMood(m)}
              aria-pressed={mood === m}
              className={`focus-ring flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors ${
                mood === m ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <span className="text-xl" aria-hidden>{MOOD_EMOJI[m]}</span>
              <span className="text-[10px] text-[var(--muted)]">{MOOD_LABELS[m]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="urge-slider" className="text-sm font-medium flex justify-between mb-2">
          <span>Urge level</span>
          <span className="text-[var(--muted)]">{urgeLevel} / 10</span>
        </label>
        <input
          id="urge-slider"
          type="range"
          min={1}
          max={10}
          value={urgeLevel}
          onChange={(e) => setUrgeLevel(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sleep-hours" className="text-sm font-medium mb-2 block">Sleep (hours)</label>
          <input
            id="sleep-hours"
            type="number"
            min={0}
            max={16}
            step={0.5}
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
          />
        </div>
        <div>
          <span className="text-sm font-medium mb-2 block">Exercise</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setExercised(true)} aria-pressed={exercised} className={`focus-ring flex-1 py-2.5 rounded-xl border text-sm font-medium ${exercised ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"}`}>Yes</button>
            <button type="button" onClick={() => setExercised(false)} aria-pressed={!exercised} className={`focus-ring flex-1 py-2.5 rounded-xl border text-sm font-medium ${!exercised ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"}`}>No</button>
          </div>
        </div>
      </div>

      <div>
        <span className="text-sm font-medium mb-2 block">Stayed in control today</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setStayedInControl(true)} aria-pressed={stayedInControl} className={`focus-ring flex-1 py-2.5 rounded-xl border text-sm font-medium ${stayedInControl ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"}`}>Yes</button>
          <button type="button" onClick={() => setStayedInControl(false)} aria-pressed={!stayedInControl} className={`focus-ring flex-1 py-2.5 rounded-xl border text-sm font-medium ${!stayedInControl ? "border-[var(--red)] bg-[var(--red)]/10 text-[var(--red)]" : "border-[var(--border)]"}`}>No</button>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-3">Triggers today</legend>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => toggleTrigger(t)}
              aria-pressed={triggers.includes(t)}
              className={`focus-ring px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                triggers.includes(t) ? "border-[var(--amber)] bg-[var(--amber)]/10 text-[var(--amber)]" : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {TRIGGER_LABELS[t]}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="note" className="text-sm font-medium mb-2 block">Note (optional)</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Anything you want to remember about today..."
          className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm resize-none"
        />
      </div>

      <Button type="submit" fullWidth size="lg">
        {existing ? "Update check-in" : "Save check-in"}
      </Button>
    </form>
  );
}
