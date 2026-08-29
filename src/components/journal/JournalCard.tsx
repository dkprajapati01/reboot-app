import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { MOOD_EMOJI } from "../../data/defaults";
import type { JournalEntry } from "../../types";

const TAG_LABELS: Record<string, string> = {
  progress: "Progress",
  trigger: "Trigger",
  win: "Win",
  reflection: "Reflection",
  difficult_day: "Difficult Day",
};

export default function JournalCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0" aria-hidden>{MOOD_EMOJI[entry.mood]}</span>
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{entry.title}</h3>
            <p className="text-xs text-[var(--muted)]">{format(new Date(entry.date), "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} aria-label="Edit entry" className="focus-ring p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} aria-label="Delete entry" className="focus-ring p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--red)] hover:bg-[var(--surface-2)]">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed line-clamp-3">{entry.body}</p>
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {entry.tags.map((t) => (
            <Badge key={t} color="var(--blue)">{TAG_LABELS[t] ?? t}</Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
