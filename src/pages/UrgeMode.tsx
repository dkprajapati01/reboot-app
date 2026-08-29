import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShieldCheck, Wind, Footprints, Smartphone, Droplets, Dumbbell, ShowerHead, Music } from "lucide-react";
import Button from "../components/ui/Button";
import BreathingCircle from "../components/urge/BreathingCircle";
import { useUrgeSessions, useUser } from "../hooks";
import { todayStr } from "../utils/date";

const TECHNIQUES = [
  { id: "walk", label: "Take a short walk", icon: Footprints },
  { id: "phone", label: "Put phone away", icon: Smartphone },
  { id: "water", label: "Drink water", icon: Droplets },
  { id: "breathing", label: "Deep breathing", icon: Wind },
  { id: "stretch", label: "Stretch", icon: Dumbbell },
  { id: "pushups", label: "Push-ups", icon: Dumbbell },
  { id: "shower", label: "Take a shower", icon: ShowerHead },
  { id: "music", label: "Listen to music", icon: Music },
];

type Step = 1 | 2 | 3 | 4;

export default function UrgeMode() {
  const navigate = useNavigate();
  const { addUrgeSession, updateUrgeSession } = useUrgeSessions();
  const { profile } = useUser();
  const [step, setStep] = useState<Step>(1);
  const [countdown, setCountdown] = useState(60);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [technique, setTechnique] = useState<string | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [urgeAfter, setUrgeAfter] = useState(5);
  const [outcome, setOutcome] = useState<"much_better" | "a_little_better" | "still_strong" | null>(null);

  useEffect(() => {
    const id = addUrgeSession({ date: todayStr(), urgeBefore: 8 });
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (step !== 1) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  const circumference = 2 * Math.PI * 88;
  const progress = ((60 - countdown) / 60) * circumference;

  function finish() {
    if (sessionId) {
      updateUrgeSession(sessionId, { urgeAfter, outcome: outcome ?? undefined, technique: technique ?? undefined });
    }
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <ShieldCheck size={18} className="text-black" />
          </div>
          <span className="font-semibold tracking-tight">REBOOT</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          aria-label="Exit urge mode"
          className="focus-ring p-2 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md text-center animate-fade-in">
          {step === 1 && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Pause.</h1>
              <p className="mt-2 text-[var(--muted)]">You don't have to act on this feeling.</p>

              {profile?.motivation && (
                <div className="mt-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-left">
                  <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">Your reason</p>
                  <p className="text-sm leading-relaxed">{profile.motivation}</p>
                </div>
              )}

              <div className="relative w-52 h-52 mx-auto my-10">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <circle cx="100" cy="100" r="88" fill="none" stroke="var(--surface-2)" strokeWidth="10" />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-semibold tabular-nums">{countdown}</span>
                </div>
              </div>

              <Button fullWidth size="lg" disabled={countdown > 0} onClick={() => setStep(2)}>
                {countdown > 0 ? "Stay with the feeling..." : "Continue"}
              </Button>
              {countdown > 0 && (
                <button onClick={() => setStep(2)} className="focus-ring mt-4 text-xs text-[var(--muted)] underline">
                  Skip ahead
                </button>
              )}
            </>
          )}

          {step === 2 && !showBreathing && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Try something different</h1>
              <p className="mt-2 text-[var(--muted)]">Pick one for the next few minutes.</p>
              <div className="grid grid-cols-2 gap-3 mt-8">
                {TECHNIQUES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTechnique(t.label);
                      if (t.id === "breathing") setShowBreathing(true);
                      else setStep(3);
                    }}
                    className="focus-ring flex flex-col items-center gap-2 py-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <t.icon size={20} className="text-[var(--primary)]" />
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && showBreathing && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Breathe with me</h1>
              <p className="mt-2 text-[var(--muted)]">Inhale 4s · Hold 4s · Exhale 6s</p>
              <BreathingCircle durationSeconds={60} onComplete={() => setStep(3)} />
              <button onClick={() => setStep(3)} className="focus-ring mt-2 text-xs text-[var(--muted)] underline">
                I'm ready to continue
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">How strong is the urge right now?</h1>
              <p className="mt-2 text-[var(--muted)]">Be honest — this helps you notice progress.</p>
              <div className="mt-10">
                <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
                  <span>1</span>
                  <span className="text-lg font-semibold text-[var(--text)]">{urgeAfter}</span>
                  <span>10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={urgeAfter}
                  onChange={(e) => setUrgeAfter(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                  aria-label="Current urge strength"
                />
              </div>
              <Button fullWidth size="lg" className="mt-10" onClick={() => setStep(4)}>
                Continue
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              {outcome ? (
                <div className="animate-pop">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] mx-auto mb-6">
                    <ShieldCheck size={30} />
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight">Well done.</h1>
                  <p className="mt-2 text-[var(--muted)] leading-relaxed">
                    You noticed the moment and chose a different response. That's exactly how progress is built.
                  </p>
                  <Button fullWidth size="lg" className="mt-8" onClick={finish}>
                    Back to dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight">Did it become easier to manage?</h1>
                  <div className="grid gap-3 mt-8">
                    {[
                      { id: "much_better", label: "Much better" },
                      { id: "a_little_better", label: "A little better" },
                      { id: "still_strong", label: "Still strong" },
                    ].map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setOutcome(o.id as any)}
                        className="focus-ring py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-sm font-medium transition-colors"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
