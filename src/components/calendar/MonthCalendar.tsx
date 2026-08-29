import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import type { DayStatus } from "../../types";

const STATUS_COLOR: Record<DayStatus, string> = {
  clean: "var(--primary)",
  difficult: "var(--amber)",
  setback: "var(--red)",
  milestone: "var(--blue)",
  untracked: "transparent",
};

interface MonthCalendarProps {
  month: Date;
  statusMap: Record<string, DayStatus>;
  onSelectDay: (date: string) => void;
}

export default function MonthCalendar({ month, statusMap, onSelectDay }: MonthCalendarProps) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--muted)] mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const status = statusMap[dateStr] ?? "untracked";
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(dateStr)}
              aria-label={`${format(day, "MMMM d, yyyy")}, ${status}`}
              className={`focus-ring aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-colors border ${
                inMonth ? "text-[var(--text)]" : "text-[var(--muted)] opacity-40"
              } ${today ? "border-[var(--primary)]" : "border-transparent hover:border-[var(--border)]"}`}
              style={{
                background: status === "untracked" ? "var(--surface-2)" : `${STATUS_COLOR[status]}26`,
              }}
            >
              <span>{format(day, "d")}</span>
              {status !== "untracked" && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ background: STATUS_COLOR[status] }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
