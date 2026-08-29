import React from "react";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import Badge from "../ui/Badge";
import type { Goal } from "../../types";

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onIncrement,
  onDecrement,
}: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const pct = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
  const complete = goal.current >= goal.target;

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{goal.title}</h3>
            {complete && <Badge color="var(--primary)" variant="solid">Complete</Badge>}
          </div>
          {goal.description && <p className="text-xs text-[var(--muted)] mt-1">{goal.description}</p>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} aria-label="Edit goal" className="focus-ring p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} aria-label="Delete goal" className="focus-ring p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--red)] hover:bg-[var(--surface-2)]">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={pct} label={`${goal.current} / ${goal.target}`} color={complete ? "var(--primary)" : "var(--blue)"} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrement}
            aria-label="Decrease progress"
            className="focus-ring w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)]"
          >
            <Minus size={13} />
          </button>
          <button
            onClick={onIncrement}
            aria-label="Increase progress"
            className="focus-ring w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)]"
          >
            <Plus size={13} />
          </button>
        </div>
        {goal.deadline && <p className="text-xs text-[var(--muted)]">Due {format(new Date(goal.deadline), "MMM d")}</p>}
      </div>
    </Card>
  );
}
