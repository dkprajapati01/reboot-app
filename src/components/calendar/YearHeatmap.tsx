import React from "react";
import { format } from "date-fns";
import type { DayStatus } from "../../types";
import { last365Days } from "../../utils/calc";

const STATUS_COLOR: Record<DayStatus, string> = {
  clean: "var(--primary)",
  difficult: "var(--amber)",
  setback: "var(--red)",
  milestone: "var(--blue)",
  untracked: "var(--surface-2)",
};

export default function YearHeatmap({ statusMap }: { statusMap: Record<string, DayStatus> }) {
  const days = last365Days();
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  const firstDay = new Date(days[0]).getDay();
  for (let i = 0; i < firstDay; i++) currentWeek.push("");

  for (const d of days) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) weeks.push(currentWeek);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-[600px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((date, di) => {
              if (!date) return <div key={di} className="w-[10px] h-[10px]" />;
              const status = statusMap[date] ?? "untracked";
              return (
                <div
                  key={date}
                  title={`${format(new Date(date), "MMM d, yyyy")}: ${status}`}
                  className="w-[10px] h-[10px] rounded-[2px]"
                  style={{ background: STATUS_COLOR[status] }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
