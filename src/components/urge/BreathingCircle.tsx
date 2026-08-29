import React, { useEffect, useState } from "react";

type Phase = "inhale" | "hold" | "exhale";

const PHASE_DURATIONS: Record<Phase, number> = { inhale: 4000, hold: 4000, exhale: 6000 };
const PHASE_LABELS: Record<Phase, string> = { inhale: "Breathe in", hold: "Hold", exhale: "Breathe out" };
const NEXT_PHASE: Record<Phase, Phase> = { inhale: "hold", hold: "exhale", exhale: "inhale" };

interface BreathingCircleProps {
  durationSeconds: number;
  onComplete?: () => void;
}

export default function BreathingCircle({ durationSeconds, onComplete }: BreathingCircleProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          setRunning(false);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, onComplete]);

  useEffect(() => {
    if (!running) return;
    const timeout = setTimeout(() => setPhase((p) => NEXT_PHASE[p]), PHASE_DURATIONS[phase]);
    return () => clearTimeout(timeout);
  }, [phase, running]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          className="absolute rounded-full bg-[var(--primary)] opacity-20"
          style={{
            width: "100%",
            height: "100%",
            animation:
              phase === "inhale"
                ? "breathe-in 4s ease-in-out forwards"
                : phase === "exhale"
                ? "breathe-out 6s ease-in-out forwards"
                : undefined,
            transform: phase === "hold" ? "scale(1)" : undefined,
          }}
        />
        <div
          className="relative rounded-full bg-[var(--primary-soft)] border border-[var(--primary)]/30 flex flex-col items-center justify-center"
          style={{
            width: "70%",
            height: "70%",
            animation:
              phase === "inhale"
                ? "breathe-in 4s ease-in-out forwards"
                : phase === "exhale"
                ? "breathe-out 6s ease-in-out forwards"
                : undefined,
          }}
        >
          <p className="text-lg font-medium text-[var(--primary)]">{PHASE_LABELS[phase]}</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {mins}:{secs.toString().padStart(2, "0")} left
          </p>
        </div>
      </div>
    </div>
  );
}
