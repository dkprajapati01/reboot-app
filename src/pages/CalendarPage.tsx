import React, { useMemo, useState } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import Card from "../components/ui/Card";
import Drawer from "../components/ui/Drawer";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import MonthCalendar from "../components/calendar/MonthCalendar";
import YearHeatmap from "../components/calendar/YearHeatmap";
import SetbackModal from "../components/checkin/SetbackModal";
import { useAppData } from "../lib/AppDataContext";
import { buildStatusMap } from "../utils/calc";
import { MOOD_LABELS, MOOD_EMOJI, TRIGGER_LABELS } from "../data/defaults";

export default function CalendarPage() {
  const { data } = useAppData();
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [setbackOpen, setSetbackOpen] = useState(false);

  const statusMap = useMemo(() => buildStatusMap(data.checkIns, data.relapses), [data.checkIns, data.relapses]);

  const counts = useMemo(() => {
    const values = Object.values(statusMap);
    return {
      clean: values.filter((v) => v === "clean" || v === "milestone").length,
      difficult: values.filter((v) => v === "difficult").length,
      setback: values.filter((v) => v === "setback").length,
      consistency: values.length
        ? Math.round(((values.filter((v) => v !== "untracked").length) / values.length) * 100)
        : 0,
    };
  }, [statusMap]);

  const selectedCheckIn = selectedDate ? data.checkIns.find((c) => c.date === selectedDate) : undefined;
  const selectedRelapse = selectedDate ? data.relapses.find((r) => r.date === selectedDate) : undefined;
  const selectedHabits = selectedDate ? data.habitLogs.filter((l) => l.date === selectedDate && l.completed) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">See your history at a glance.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold">{format(month, "MMMM yyyy")}</h2>
          <div className="flex gap-1">
            <button onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Previous month" className="focus-ring p-2 rounded-lg hover:bg-[var(--surface-2)]">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Next month" className="focus-ring p-2 rounded-lg hover:bg-[var(--surface-2)]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <MonthCalendar month={month} statusMap={statusMap} onSelectDay={setSelectedDate} />
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-[var(--muted)]">
          <LegendDot color="var(--primary)" label="Clean" />
          <LegendDot color="var(--amber)" label="Difficult day" />
          <LegendDot color="var(--red)" label="Setback" />
          <LegendDot color="var(--blue)" label="Milestone" />
          <LegendDot color="var(--surface-2)" label="Not tracked" />
        </div>
      </Card>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Clean days", value: counts.clean, color: "var(--primary)" },
          { label: "Difficult days", value: counts.difficult, color: "var(--amber)" },
          { label: "Setbacks", value: counts.setback, color: "var(--red)" },
          { label: "Consistency", value: `${counts.consistency}%`, color: "var(--blue)" },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-2xl font-semibold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Yearly overview</h2>
        <YearHeatmap statusMap={statusMap} />
      </Card>

      <Button variant="outline" icon={<AlertTriangle size={16} />} onClick={() => setSetbackOpen(true)}>
        Record a setback
      </Button>

      <Drawer open={!!selectedDate} onClose={() => setSelectedDate(null)} title={selectedDate ? format(new Date(selectedDate), "EEEE, MMMM d") : ""}>
        {selectedDate && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Badge color={statusColor(statusMap[selectedDate])} variant="solid">
                {statusMap[selectedDate] ? statusLabel(statusMap[selectedDate]) : "Not tracked"}
              </Badge>
            </div>

            {selectedCheckIn ? (
              <>
                <Row label="Mood" value={`${MOOD_EMOJI[selectedCheckIn.mood]} ${MOOD_LABELS[selectedCheckIn.mood]}`} />
                <Row label="Urge level" value={`${selectedCheckIn.urgeLevel} / 10`} />
                <Row label="Sleep" value={`${selectedCheckIn.sleepHours}h`} />
                <Row label="Exercise" value={selectedCheckIn.exercised ? "Yes" : "No"} />
                {selectedCheckIn.triggers.length > 0 && (
                  <div>
                    <p className="text-xs text-[var(--muted)] mb-2">Triggers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCheckIn.triggers.map((t) => (
                        <Badge key={t} color="var(--amber)">{TRIGGER_LABELS[t]}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCheckIn.note && (
                  <div>
                    <p className="text-xs text-[var(--muted)] mb-1.5">Note</p>
                    <p className="text-sm bg-[var(--surface-2)] rounded-xl p-3">{selectedCheckIn.note}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">No check-in recorded for this day.</p>
            )}

            {selectedRelapse && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-1.5">Reflection</p>
                <p className="text-sm bg-[var(--surface-2)] rounded-xl p-3">{selectedRelapse.reflection || "No reflection recorded."}</p>
              </div>
            )}

            {selectedHabits.length > 0 && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-2">Habits completed</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHabits.map((l) => {
                    const habit = data.habits.find((h) => h.id === l.habitId);
                    return habit ? <Badge key={l.id} color={habit.color}>{habit.name}</Badge> : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <SetbackModal open={setbackOpen} onClose={() => setSetbackOpen(false)} />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function statusColor(status?: string) {
  switch (status) {
    case "clean": return "var(--primary)";
    case "difficult": return "var(--amber)";
    case "setback": return "var(--red)";
    case "milestone": return "var(--blue)";
    default: return "var(--muted)";
  }
}
function statusLabel(status: string) {
  switch (status) {
    case "clean": return "Clean day";
    case "difficult": return "Difficult day";
    case "setback": return "Setback";
    case "milestone": return "Milestone";
    default: return "Not tracked";
  }
}
