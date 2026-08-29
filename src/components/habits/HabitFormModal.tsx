import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Habit } from "../../types";

const ICON_OPTIONS = [
  "Dumbbell", "BrainCircuit", "BookOpen", "Droplets", "Moon", "Sunrise",
  "Footprints", "SmartphoneOff", "Music", "Utensils", "PenLine", "Bike",
];
const COLOR_OPTIONS = ["#22C55E", "#3B82F6", "#F59E0B", "#38BDF8", "#A78BFA", "#FB923C", "#34D399", "#F472B6"];

interface HabitFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: { name: string; icon: string; color: string }) => void;
  initial?: Habit;
}

export default function HabitFormModal({ open, onClose, onSave, initial }: HabitFormModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setIcon(initial?.icon ?? ICON_OPTIONS[0]);
      setColor(initial?.color ?? COLOR_OPTIONS[0]);
    }
  }, [open, initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, color });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit habit" : "Add habit"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="habit-name" className="text-sm font-medium mb-2 block">Name</label>
          <input
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cold shower"
            className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            autoFocus
          />
        </div>
        <div>
          <span className="text-sm font-medium mb-2 block">Icon</span>
          <div className="grid grid-cols-6 gap-2">
            {ICON_OPTIONS.map((ic) => {
              const Icon = (Icons as any)[ic];
              return (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  aria-pressed={icon === ic}
                  className={`focus-ring aspect-square rounded-lg flex items-center justify-center border ${
                    icon === ic ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <span className="text-sm font-medium mb-2 block">Color</span>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                aria-label={`Color ${c}`}
                className={`focus-ring w-8 h-8 rounded-full border-2 ${color === c ? "border-[var(--text)]" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
        <Button type="submit" fullWidth>{initial ? "Save changes" : "Add habit"}</Button>
      </form>
    </Modal>
  );
}
