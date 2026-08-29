import React from "react";
import Card from "./Card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  icon?: React.ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, sublabel, icon, accent = "var(--primary)" }: StatCardProps) {
  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight animate-count">{value}</p>
          {sublabel && <p className="mt-1 text-xs text-[var(--muted)]">{sublabel}</p>}
        </div>
        {icon && (
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}1a`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
