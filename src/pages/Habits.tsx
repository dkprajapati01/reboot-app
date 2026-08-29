import React, { useState } from "react";
import * as Icons from "lucide-react";
import { Plus, Pencil, Trash2, Check, ListChecks } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import HabitFormModal from "../components/habits/HabitFormModal";
import { useHabits } from "../hooks";
import { habitCompletionRate, habitStreak, last30Days } from "../utils/calc";
import { todayStr } from "../utils/date";
import type { Habit } from "../types";
import { useToast } from "../components/ui/Toast";

export default function Habits() {
  const { habits, habitLogs, addHabit, updateHabit, deleteHabit, toggleHabitLog } = useHabits();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);

  const week = last30Days().slice(-7);

  function handleSave(vals: { name: string; icon: string; color: string }) {
    if (editing) {
      updateHabit(editing.id, vals);
      showToast("Habit updated");
    } else {
      addHabit(vals);
      showToast("Habit added");
    }
    setEditing(undefined);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Habits</h1>
          <p className="text-[var(--muted)] mt-1 text-sm">Build the routines that support you.</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          Add habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ListChecks size={24} />}
            title="No habits yet"
            description="Add a habit to start tracking daily completion and streaks."
            action={<Button onClick={() => setFormOpen(true)} icon={<Plus size={16} />}>Add habit</Button>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {habits.map((h) => {
            const Icon = (Icons as any)[h.icon] || Icons.Circle;
            const rate = habitCompletionRate(h.id, habitLogs, 30);
            const streak = habitStreak(h.id, habitLogs);
            return (
              <Card key={h.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${h.color}1a`, color: h.color }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{h.name}</p>
                      <p className="text-xs text-[var(--muted)]">{streak} day streak · {rate}% (30d)</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditing(h);
                        setFormOpen(true);
                      }}
                      aria-label={`Edit ${h.name}`}
                      className="focus-ring p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(h)}
                      aria-label={`Delete ${h.name}`}
                      className="focus-ring p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--red)] hover:bg-[var(--surface-2)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mt-5 gap-1">
                  {week.map((date) => {
                    const log = habitLogs.find((l) => l.habitId === h.id && l.date === date);
                    const isToday = date === todayStr();
                    return (
                      <button
                        key={date}
                        onClick={() => toggleHabitLog(h.id, date)}
                        aria-pressed={!!log?.completed}
                        aria-label={`${h.name} on ${date}`}
                        className={`focus-ring flex-1 aspect-square rounded-lg flex items-center justify-center border transition-colors ${
                          log?.completed
                            ? "text-black"
                            : isToday
                            ? "border-[var(--primary)] text-[var(--muted)]"
                            : "border-[var(--border)] text-transparent hover:bg-[var(--surface-2)]"
                        }`}
                        style={log?.completed ? { background: h.color, borderColor: h.color } : undefined}
                      >
                        <Check size={13} />
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <HabitFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete habit"
        description={`This will remove "${deleteTarget?.name}" and its history. This can't be undone.`}
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteHabit(deleteTarget.id);
            showToast("Habit deleted", "info");
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
