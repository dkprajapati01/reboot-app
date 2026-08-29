import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { TRIGGER_LABELS } from "../../data/defaults";
import type { Trigger } from "../../types";
import { useAppData } from "../../lib/AppDataContext";
import { todayStr } from "../../utils/date";
import { useToast } from "../ui/Toast";

const TRIGGERS: Trigger[] = ["boredom", "stress", "loneliness", "social_media", "late_night", "anxiety", "habit", "other"];

export default function SetbackModal({ open, onClose, date = todayStr() }: { open: boolean; onClose: () => void; date?: string }) {
  const { recordRelapse } = useAppData();
  const { showToast } = useToast();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggle(t: Trigger) {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function handleSubmit() {
    recordRelapse({ date, triggers, reflection });
    setSubmitted(true);
    showToast("Reset and keep moving.", "info");
  }

  function handleClose() {
    setSubmitted(false);
    setTriggers([]);
    setReflection("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={submitted ? undefined : "Reset, don't punish yourself."}>
      {submitted ? (
        <div className="text-center py-4 animate-pop">
          <p className="text-lg font-semibold">Your overall progress is still here.</p>
          <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
            One difficult moment doesn't erase the progress you've already made. Notice the pattern, change the response, and focus on today.
          </p>
          <Button fullWidth className="mt-6" onClick={handleClose}>
            Continue
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            One difficult moment doesn't erase the progress you've already made.
          </p>
          <fieldset>
            <legend className="text-sm font-medium mb-3">What triggered it?</legend>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggle(t)}
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
            <label htmlFor="setback-reflection" className="text-sm font-medium mb-2 block">What might help next time?</label>
            <textarea
              id="setback-reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              placeholder="A small idea for next time..."
              className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm resize-none"
            />
          </div>
          <Button fullWidth onClick={handleSubmit}>
            Save and reset
          </Button>
        </div>
      )}
    </Modal>
  );
}
