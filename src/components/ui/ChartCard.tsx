import React from "react";
import Card from "./Card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
