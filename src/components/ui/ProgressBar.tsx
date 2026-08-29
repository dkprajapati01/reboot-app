import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: number;
  label?: string;
}

export default function ProgressBar({ value, color = "var(--primary)", height = 8, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-[var(--muted)] mb-1.5">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full bg-[var(--surface-2)] overflow-hidden"
        style={{ height }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
    </div>
  );
}
