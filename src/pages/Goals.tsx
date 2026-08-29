import React, { useState } from "react";
import { Plus, Target } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import GoalFormModal from "../components/goals/GoalFormModal";
import GoalCard from "../components/goals/GoalCard";
import { useGoals } from "../hooks";
import { useToast } from "../components/ui/Toast";
import type { Goal } from "../types";

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

  function handleSave(vals: {
    title: string;
    description: string;
    target: number;
    current: number;
    deadline?: string;
    frequency: "daily" | "weekly" | "once";
  }) {
    if (editing) {
      updateGoal(editing.id, { ...vals, completed: vals.current >= vals.target });
      showToast("Goal updated");
    } else {
      addGoal(vals);
      showToast("Goal added");
    }
    setEditing(undefined);
  }

  function adjust(goal: Goal, delta: number) {
    const current = Math.max(0, Math.min(goal.target, goal.current + delta));
    updateGoal(goal.id, { current, completed: current >= goal.target });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
          <p className="text-[var(--muted)] mt-1 text-sm">Choose what you're working toward.</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          New goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target size={24} />}
            title="Choose one small goal to get started."
            action={<Button onClick={() => setFormOpen(true)} icon={<Plus size={16} />}>New goal</Button>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={() => {
                setEditing(g);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(g)}
              onIncrement={() => adjust(g, 1)}
              onDecrement={() => adjust(g, -1)}
            />
          ))}
        </div>
      )}

      <GoalFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initial={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete goal"
        description="This goal and its progress will be removed."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteGoal(deleteTarget.id);
            showToast("Goal deleted", "info");
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
