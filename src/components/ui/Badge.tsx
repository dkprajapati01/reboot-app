import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "solid" | "soft";
}

export default function Badge({ children, color = "var(--muted)", variant = "soft" }: BadgeProps) {
  if (variant === "solid") {
    return (
      <span
        className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full text-black"
        style={{ background: color }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: `${color}1f`, color }}
    >
      {children}
    </span>
  );
}
