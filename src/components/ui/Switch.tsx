import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export default function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="focus-ring shrink-0 inline-flex items-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        width: 40,
        height: 24,
        padding: 2,
        background: checked ? "var(--primary)" : "var(--surface-2)",
        border: checked ? "1px solid var(--primary)" : "1px solid var(--border)",
        justifyContent: checked ? "flex-end" : "flex-start",
      }}
    >
      <span
        aria-hidden
        className="block rounded-full bg-white shadow-sm transition-transform"
        style={{ width: 18, height: 18 }}
      />
    </button>
  );
}
