import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Check, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import { useAppData } from "../lib/AppDataContext";
import { useAuth } from "../lib/AuthContext";
import { genId } from "../services/storageService";
import { todayStr } from "../utils/date";
import { FOCUS_OPTIONS } from "../data/defaults";

const TARGETS = [7, 14, 30, 60, 90];

const STEP_LABELS = ["Welcome", "Focus", "Target", "Reminder", "Theme", "Finish"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile, ensureDefaultHabits, updateSettings } = useAppData();
  const { account } = useAuth();
  const [step, setStep] = useState(0);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [target, setTarget] = useState<number | "custom">(30);
  const [customTarget, setCustomTarget] = useState(45);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

  function toggleFocus(id: string) {
    setFocusAreas((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function finish() {
    const targetDays = target === "custom" ? customTarget : target;
    saveProfile({
      id: genId(),
      name: account?.name ?? "You",
      focusAreas,
      targetDays,
      reminderTime,
      theme,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      startDate: todayStr(),
    });
    updateSettings({ theme });
    ensureDefaultHabits();
    navigate("/dashboard");
  }

  const canAdvance =
    step === 1 ? focusAreas.length > 0 : true;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <div className="px-6 sm:px-10 h-16 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <ShieldCheck size={18} className="text-black" />
        </div>
        <span className="font-semibold tracking-tight text-lg">REBOOT</span>
      </div>

      <div className="px-6 sm:px-10 mb-8">
        <div className="max-w-md mx-auto flex items-center gap-1.5">
          {STEP_LABELS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-[var(--primary)]" : "bg-[var(--surface-2)]"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 sm:px-10 flex items-start justify-center">
        <div className="w-full max-w-md animate-fade-in">
          {step === 0 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mx-auto mb-6">
                <ShieldCheck size={30} />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to REBOOT</h1>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                A private space to build awareness, track your progress, and create routines that
                actually stick. Let's set things up — it takes less than a minute.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">What do you want to improve?</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">Choose as many as apply.</p>
              <div className="mt-6 space-y-2.5">
                {FOCUS_OPTIONS.map((opt) => {
                  const active = focusAreas.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleFocus(opt.id)}
                      className={`focus-ring w-full flex items-center justify-between text-left px-4 py-3.5 rounded-xl border transition-colors ${
                        active
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      {active && <Check size={16} className="text-[var(--primary)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Choose your target</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">You can change this any time.</p>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {TARGETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTarget(t)}
                    className={`focus-ring py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                      target === t ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {t} days
                  </button>
                ))}
                <button
                  onClick={() => setTarget("custom")}
                  className={`focus-ring py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                    target === "custom" ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  Custom
                </button>
              </div>
              {target === "custom" && (
                <div className="mt-4">
                  <input
                    type="number"
                    min={1}
                    value={customTarget}
                    onChange={(e) => setCustomTarget(Number(e.target.value))}
                    className="focus-ring w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm"
                    aria-label="Custom target in days"
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Daily reminder</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                When should REBOOT nudge you to check in?
              </p>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="focus-ring mt-6 w-full px-4 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-lg font-medium text-center"
                aria-label="Daily reminder time"
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Choose your theme</h1>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {(["dark", "light", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`focus-ring py-3.5 rounded-xl border text-sm font-medium capitalize transition-colors ${
                      theme === t ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mx-auto mb-6">
                <Check size={30} />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">You're all set</h1>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                Focus on today. Progress is built one day at a time.
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-10 pb-10">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
            )}
            <Button
              fullWidth
              disabled={!canAdvance}
              onClick={() => (step === STEP_LABELS.length - 1 ? finish() : setStep((s) => s + 1))}
              icon={step === STEP_LABELS.length - 1 ? undefined : undefined}
            >
              {step === STEP_LABELS.length - 1 ? "Go to Dashboard" : "Continue"}
              {step !== STEP_LABELS.length - 1 && <ArrowRight size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
