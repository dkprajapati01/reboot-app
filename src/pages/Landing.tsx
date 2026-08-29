import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Play,
  LineChart,
  Brain,
  Hand,
  ListChecks,
  NotebookPen,
  Lock,
  Flame,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

const sections = [
  {
    icon: LineChart,
    title: "Track your progress",
    body: "Log daily check-ins on mood, urges, sleep and control. Watch your streak and consistency build over time, visualized clearly.",
    color: "var(--primary)",
  },
  {
    icon: Brain,
    title: "Understand your triggers",
    body: "Automatic, rule-based insights surface the patterns behind difficult days — so you can respond to what's actually happening.",
    color: "var(--blue)",
  },
  {
    icon: Hand,
    title: "Handle difficult moments",
    body: "Urge Mode gives you a calm, focused space with a pause timer, grounding techniques, and breathing exercises when it matters most.",
    color: "var(--amber)",
  },
  {
    icon: ListChecks,
    title: "Build healthier habits",
    body: "Track the routines that support you — exercise, sleep, reading — and see how they connect to your consistency.",
    color: "var(--primary)",
  },
  {
    icon: NotebookPen,
    title: "Reflect and improve",
    body: "A private journal for processing wins, setbacks, and everything in between, tagged and searchable.",
    color: "var(--blue)",
  },
  {
    icon: Lock,
    title: "Privacy-first design",
    body: "Your data stays on this device. Accounts are local-only, with no tracking or analytics. Export or delete your data whenever you choose.",
    color: "var(--muted)",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { account, continueAsGuest } = useAuth();

  function handleViewDemo() {
    continueAsGuest();
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="flex items-center justify-between px-6 sm:px-10 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <ShieldCheck size={18} className="text-black" />
          </div>
          <span className="font-semibold tracking-tight text-lg">REBOOT</span>
        </div>
        <Link
          to={account ? "/dashboard" : "/sign-in"}
          className="focus-ring text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          {account ? "Open app" : "Sign in"}
        </Link>
      </header>

      <section className="px-6 sm:px-10 pt-14 sm:pt-20 pb-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
              Build control. Understand yourself. Move forward.
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.08]">
              Take back your control.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--muted)] max-w-lg leading-relaxed">
              Build awareness, understand your patterns, and create healthier routines — one day at a time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/sign-up" className="focus-ring inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-black font-medium px-6 py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all">
                Start My Journey
                <ArrowRight size={16} />
              </Link>
              <button onClick={handleViewDemo} className="focus-ring inline-flex items-center justify-center gap-2 border border-[var(--border)] font-medium px-6 py-3.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
                <Play size={16} />
                View Demo
              </button>
            </div>
            <p className="mt-6 text-xs text-[var(--muted)] flex items-center gap-1.5">
              <Lock size={12} /> Your data stays on this device.
            </p>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute -inset-6 bg-[var(--primary)] opacity-[0.06] blur-3xl rounded-full" />
            <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-soft)] p-6 sm:p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-medium">Current Streak</p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-4xl font-semibold tracking-tight">18</span>
                    <span className="text-sm text-[var(--muted)]">days</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)]">
                  <Flame size={20} />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
                  <span>30 day goal</span>
                  <span>18 / 30</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: "60%" }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Best streak", value: "31" },
                  { label: "Clean days", value: "74" },
                  { label: "Consistency", value: "84%" },
                ].map((s) => (
                  <div key={s.label} className="bg-[var(--surface-2)] rounded-xl p-3">
                    <p className="text-lg font-semibold">{s.value}</p>
                    <p className="text-[11px] text-[var(--muted)] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-16 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s) => (
            <div key={s.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${s.color}1a`, color: s.color }}
              >
                <s.icon size={20} />
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10 py-20 border-t border-[var(--border)] text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Start with today.</h2>
        <p className="mt-3 text-[var(--muted)] max-w-md mx-auto">
          One check-in. One habit. One small step forward.
        </p>
        <Link
          to="/sign-up"
          className="focus-ring mt-7 inline-flex items-center gap-2 bg-[var(--primary)] text-black font-medium px-6 py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Start My Journey
          <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="px-6 sm:px-10 py-8 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
        REBOOT — private, local-first personal progress tracking.
      </footer>
    </div>
  );
}
