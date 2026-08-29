import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] mb-4">
          {icon}
        </div>
      )}
      <p className="font-medium text-[var(--text)]">{title}</p>
      {description && <p className="text-sm text-[var(--muted)] mt-1.5 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
