import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Lightbulb, Flame, Trophy, CalendarCheck, Gauge, Moon } from "lucide-react";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import ChartCard from "../components/ui/ChartCard";
import { useAppData } from "../lib/AppDataContext";
import { useStreak } from "../hooks";
import { last30Days, averageUrge, averageSleep, moodToScore, habitCompletionRate } from "../utils/calc";
import { generateInsights } from "../utils/insights";
import { TRIGGER_LABELS } from "../data/defaults";
import { format } from "date-fns";

const PIE_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#A78BFA", "#38BDF8", "#FB923C", "#F472B6"];

export default function Insights() {
  const { data } = useAppData();
  const streak = useStreak();
  const insights = useMemo(() => generateInsights(data), [data]);
  const days = last30Days();

  const urgeMoodTrend = days.map((d) => {
    const c = data.checkIns.find((c) => c.date === d);
    return {
      date: format(new Date(d), "MMM d"),
      urge: c ? c.urgeLevel : null,
      mood: c ? moodToScore(c.mood) : null,
    };
  });

  const weeklyConsistency = useMemo(() => {
    const weeks: { label: string; pct: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekDays = last30Days().slice((3 - w) * 7, (3 - w) * 7 + 7);
      const tracked = weekDays.filter((d) => data.checkIns.some((c) => c.date === d)).length;
      weeks.push({ label: `Week ${4 - w}`, pct: Math.round((tracked / 7) * 100) });
    }
    return weeks;
  }, [data.checkIns]);

  const cleanVsSetback = useMemo(() => {
    return weeklyConsistency.map((w, i) => {
      const weekDays = last30Days().slice(i * 7, i * 7 + 7);
      const clean = weekDays.filter((d) => {
        const c = data.checkIns.find((c) => c.date === d);
        return c && c.stayedInControl;
      }).length;
      const setback = weekDays.filter((d) => data.relapses.some((r) => r.date === d)).length;
      return { label: w.label, clean, setback };
    });
  }, [data.checkIns, data.relapses, weeklyConsistency]);

  const triggerDist = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of data.checkIns) for (const t of c.triggers) counts[t] = (counts[t] || 0) + 1;
    return Object.entries(counts)
      .map(([id, value]) => ({ name: TRIGGER_LABELS[id as keyof typeof TRIGGER_LABELS] ?? id, value }))
      .sort((a, b) => b.value - a.value);
  }, [data.checkIns]);

  const sleepVsUrge = useMemo(
    () => data.checkIns.filter((c) => c.date >= days[0]).map((c) => ({ x: c.sleepHours, y: c.urgeLevel })),
    [data.checkIns]
  );

  const exerciseVsUrge = useMemo(() => {
    const ex = data.checkIns.filter((c) => c.exercised);
    const noEx = data.checkIns.filter((c) => !c.exercised);
    const avg = (arr: typeof ex) => (arr.length ? Math.round((arr.reduce((s, c) => s + c.urgeLevel, 0) / arr.length) * 10) / 10 : 0);
    return [
      { label: "Exercised", value: avg(ex) },
      { label: "No exercise", value: avg(noEx) },
    ];
  }, [data.checkIns]);

  const habitCompletion = useMemo(
    () => data.habits.map((h) => ({ label: h.name, value: habitCompletionRate(h.id, data.habitLogs, 30) })),
    [data.habits, data.habitLogs]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Patterns from your own data, not diagnoses.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard label="Current streak" value={streak.current} icon={<Flame size={16} />} />
        <StatCard label="Best streak" value={streak.longest} icon={<Trophy size={16} />} accent="var(--amber)" />
        <StatCard label="Clean days" value={streak.clean} icon={<CalendarCheck size={16} />} accent="var(--blue)" />
        <StatCard label="Consistency" value={`${streak.consistency}%`} icon={<Gauge size={16} />} />
        <StatCard label="Avg urge" value={averageUrge(data.checkIns)} icon={<Gauge size={16} />} accent="var(--red)" />
        <StatCard label="Avg sleep" value={`${averageSleep(data.checkIns)}h`} icon={<Moon size={16} />} accent="var(--blue)" />
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-[var(--amber)]" />
          <h2 className="font-semibold">Local insights</h2>
        </div>
        <ul className="space-y-2.5">
          {insights.map((ins, i) => (
            <li key={i} className="text-sm text-[var(--muted)] flex gap-2">
              <span className="text-[var(--primary)]">•</span>
              {ins}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-[var(--muted)] mt-4">
          These observations are generated from your own logged data using simple rules. They are not medical advice or a diagnosis.
        </p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Urge & mood trend" subtitle="Last 30 days">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={urgeMoodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted)" }} interval={5} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} domain={[0, 10]} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="urge" name="Urge" stroke="var(--red)" strokeWidth={2} dot={false} connectNulls />
              <Line type="monotone" dataKey="mood" name="Mood" stroke="var(--blue)" strokeWidth={2} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly consistency" subtitle="% of days tracked">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyConsistency}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} domain={[0, 100]} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="pct" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Clean vs setback days" subtitle="Last 4 weeks">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cleanVsSetback}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="clean" name="Clean" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="setback" name="Setback" stackId="a" fill="var(--red)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trigger distribution" subtitle="All time">
          {triggerDist.length === 0 ? (
            <p className="text-sm text-[var(--muted)] py-16 text-center">No triggers logged yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={triggerDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {triggerDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Sleep vs urge" subtitle="Last 30 days">
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" dataKey="x" name="Sleep (h)" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="y" name="Urge" domain={[0, 10]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={sleepVsUrge} fill="var(--blue)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Exercise vs urge" subtitle="Average urge level">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={exerciseVsUrge} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "var(--text)" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {habitCompletion.length > 0 && (
        <ChartCard title="Habit completion" subtitle="Last 30 days">
          <ResponsiveContainer width="100%" height={Math.max(180, habitCompletion.length * 40)}>
            <BarChart data={habitCompletion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "var(--text)" }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" fill="var(--blue)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
