import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Trophy, Hand, Check, Plus, Sparkles, ShieldHalf } from "lucide-react";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import ProgressBar from "../components/ui/ProgressBar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import CheckInForm from "../components/checkin/CheckInForm";
import HabitRow from "../components/habits/HabitRow";
import { greeting, todayStr } from "../utils/date";
import { useUser, useStreak, useCheckIns, useHabits, useAchievements } from "../hooks";
import { useAppData } from "../lib/AppDataContext";
import { MOTIVATION_PROMPTS } from "../data/defaults";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const streak = useStreak();
  const { getCheckInForDate } = useCheckIns();
  const { habits, habitLogs, toggleHabitLog } = useHabits();
  const { data } = useAppData();
  const [checkInOpen, setCheckInOpen] = useState(false);

  const todayCheckIn = getCheckInForDate(todayStr());
  const target = profile?.targetDays ?? 30;
  const progressPct = Math.min(100, (streak.current / target) * 100);

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyQuote = MOTIVATION_PROMPTS[dayOfYear % MOTIVATION_PROMPTS.length];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{greeting()} 👋</h1>
        <p className="text-[var(--muted)] mt-1">Focus on today. Progress is built one day at a time.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[var(--primary)] opacity-[0.07] blur-3xl rounded-full" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Current Streak</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-semibold tracking-tight">{streak.current}</span>
                <span className="text-base text-[var(--muted)]">days</span>
              </div>
              {data.settings.streakProtection && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-medium text-[var(--blue)] bg-[var(--blue)]/10 px-2.5 py-1 rounded-full">
                  <ShieldHalf size={11} /> Streak protection on
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)]">
              <Flame size={22} />
            </div>
          </div>
          <div className="relative mt-8">
            <ProgressBar value={progressPct} label={`${target} day goal · ${streak.current} / ${target}`} height={10} />
          </div>
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Best streak", value: streak.longest },
              { label: "Clean days", value: streak.clean },
              { label: "Tracked days", value: streak.tracked },
              { label: "Consistency", value: `${streak.consistency}%` },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--surface-2)] rounded-xl p-3.5">
                <p className="text-xl font-semibold">{s.value}</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between bg-gradient-to-br">
          <div>
            <div className="w-11 h-11 rounded-xl bg-[var(--red)]/10 flex items-center justify-center text-[var(--red)] mb-4">
              <Hand size={20} />
            </div>
            <h3 className="font-semibold">Having an urge right now?</h3>
            <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
              Take a moment. Pause, breathe, and choose a different response.
            </p>
          </div>
          <Button variant="danger" fullWidth className="mt-6" onClick={() => navigate("/urge-mode")}>
            I'm having an urge
          </Button>
        </Card>
      </div>

      <Card className="flex items-start gap-3 bg-[var(--surface-2)]">
        <div className="w-9 h-9 rounded-lg bg-[var(--amber)]/10 flex items-center justify-center text-[var(--amber)] shrink-0">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wide">
            {profile?.motivation ? "Your reason" : "Today's reminder"}
          </p>
          <p className="text-sm mt-1 leading-relaxed">{profile?.motivation || dailyQuote}</p>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">Today's check-in</h3>
            {todayCheckIn && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)]">
                <Check size={14} /> Logged
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] mb-4">
            {todayCheckIn ? "You've already checked in today. You can update it any time." : "Take 30 seconds to reflect on how today is going."}
          </p>
          <Button onClick={() => setCheckInOpen(true)} variant={todayCheckIn ? "outline" : "primary"}>
            {todayCheckIn ? "Update check-in" : "Start check-in"}
          </Button>
        </Card>

        <StatCard
          label="Achievements"
          value={<AchievementCount />}
          sublabel="unlocked"
          icon={<Trophy size={18} />}
          accent="var(--amber)"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Today's habits</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/habits")} icon={<Plus size={14} />}>
            Manage
          </Button>
        </div>
        {habits.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No habits yet. Add some from the Habits page.</p>
        ) : (
          <div className="space-y-1">
            {habits.slice(0, 6).map((h) => (
              <HabitRow key={h.id} habit={h} logs={habitLogs} onToggle={() => toggleHabitLog(h.id, todayStr())} />
            ))}
          </div>
        )}
      </Card>

      <Modal open={checkInOpen} onClose={() => setCheckInOpen(false)} title="Daily check-in">
        <CheckInForm onDone={() => setCheckInOpen(false)} />
      </Modal>
    </div>
  );
}

function AchievementCount() {
  const { achievements } = useAchievements();
  const unlocked = achievements.filter((a) => a.unlockedAt).length;
  return <>{unlocked} / {achievements.length}</>;
}
