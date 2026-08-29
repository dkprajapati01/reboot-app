import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { MOOD_EMOJI, MOOD_LABELS } from "../../data/defaults";
import type { Mood, JournalEntry } from "../../types";
import { todayStr } from "../../utils/date";

const MOODS: Mood[] = ["very_low", "low", "neutral", "good", "great"];
const TAGS = ["progress", "trigger", "win", "reflection", "difficult_day"];
const TAG_LABELS: Record<string, string> = {
  progress: "Progress",
  trigger: "Trigger",
  win: "Win",
  reflection: "Reflection",
  difficult_day: "Difficult Day",
};

interface JournalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: { date: string; mood: Mood; title: string; body: string; tags: string[] }) => void;
  initial?: JournalEntry;
}

export default function JournalFormModal({ open, onClose, onSave, initial }: JournalFormModalProps) {
  const [date, setDate] = useState(todayStr());
  const [mood, setMood] = useState<Mood>("neutral");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setDate(initial?.date ?? todayStr());
      setMood(initial?.mood ?? "neutral");
      setTitle(initial?.title ?? "");
      setBody(initial?.body ?? "");
      setTags(initial?.tags ?? []);
    }
  }, [open, initial]);

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    onSave({ date, mood, title: title.trim() || "Untitled entry", body: body.trim(), tags });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit entry" : "New journal entry"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="j-date" className="text-sm font-medium mb-2 block">Date</label>
            <input
              id="j-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            />
          </div>
          <div>
            <span className="text-sm font-medium mb-2 block">Mood</span>
            <div className="flex gap-1">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMood(m)}
                  aria-pressed={mood === m}
                  aria-label={MOOD_LABELS[m]}
                  className={`focus-ring flex-1 py-2 rounded-lg border text-base ${mood === m ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"}`}
                >
                  {MOOD_EMOJI[m]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="j-title" className="text-sm font-medium mb-2 block">Title</label>
          <input
            id="j-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A short title"
            className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
          />
        </div>
        <div>
          <label htmlFor="j-body" className="text-sm font-medium mb-2 block">What's on your mind?</label>
          <textarea
            id="j-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write freely..."
            className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm resize-none"
            autoFocus
          />
        </div>
        <fieldset>
          <legend className="text-sm font-medium mb-3">Tags</legend>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => toggleTag(t)}
                aria-pressed={tags.includes(t)}
                className={`focus-ring px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                  tags.includes(t) ? "border-[var(--blue)] bg-[var(--blue)]/10 text-[var(--blue)]" : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
        </fieldset>
        <Button type="submit" fullWidth>{initial ? "Save changes" : "Save entry"}</Button>
      </form>
    </Modal>
  );
}
