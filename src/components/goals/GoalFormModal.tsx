import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Goal } from "../../types";

interface GoalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: {
    title: string;
    description: string;
    target: number;
    current: number;
    deadline?: string;
    frequency: "daily" | "weekly" | "once";
  }) => void;
  initial?: Goal;
}

export default function GoalFormModal({ open, onClose, onSave, initial }: GoalFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState(30);
  const [current, setCurrent] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "once">("daily");

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setTarget(initial?.target ?? 30);
      setCurrent(initial?.current ?? 0);
      setDeadline(initial?.deadline ?? "");
      setFrequency(initial?.frequency ?? "daily");
    }
  }, [open, initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), target, current, deadline: deadline || undefined, frequency });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit goal" : "New goal"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="g-title" className="text-sm font-medium mb-2 block">Title</label>
          <input
            id="g-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 30 days of consistency"
            className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="g-desc" className="text-sm font-medium mb-2 block">Description</label>
          <textarea
            id="g-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="What does success look like?"
            className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="g-target" className="text-sm font-medium mb-2 block">Target</label>
            <input
              id="g-target"
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            />
          </div>
          <div>
            <label htmlFor="g-current" className="text-sm font-medium mb-2 block">Current progress</label>
            <input
              id="g-current"
              type="number"
              min={0}
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="g-freq" className="text-sm font-medium mb-2 block">Frequency</label>
            <select
              id="g-freq"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="once">Once</option>
            </select>
          </div>
          <div>
            <label htmlFor="g-deadline" className="text-sm font-medium mb-2 block">Deadline (optional)</label>
            <input
              id="g-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            />
          </div>
        </div>
        <Button type="submit" fullWidth>{initial ? "Save changes" : "Add goal"}</Button>
      </form>
    </Modal>
  );
}
