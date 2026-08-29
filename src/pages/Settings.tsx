import React, { useState } from "react";
import { Download, Trash2, RotateCcw, Lock, ShieldCheck, Check, ShieldHalf, Pencil, LogOut, User as UserIcon } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Switch from "../components/ui/Switch";
import { useAppData } from "../lib/AppDataContext";
import { useAuth } from "../lib/AuthContext";
import { downloadExport, genId } from "../services/storageService";
import { useToast } from "../components/ui/Toast";
import { useUser } from "../hooks";
import { FOCUS_OPTIONS } from "../data/defaults";
import { todayStr } from "../utils/date";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { data, userId, updateSettings, resetAllData, loadDemoData } = useAppData();
  const { profile, saveProfile } = useUser();
  const { account, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetDemoOpen, setResetDemoOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [name, setName] = useState(profile?.name ?? "You");
  const [focusAreas, setFocusAreas] = useState<string[]>(profile?.focusAreas ?? []);
  const [targetDays, setTargetDays] = useState(profile?.targetDays ?? 30);
  const [motivation, setMotivation] = useState(profile?.motivation ?? "");

  function startEditing() {
    setName(profile?.name ?? "You");
    setFocusAreas(profile?.focusAreas ?? []);
    setTargetDays(profile?.targetDays ?? 30);
    setMotivation(profile?.motivation ?? "");
    setEditingProfile(true);
  }

  function toggleFocus(id: string) {
    setFocusAreas((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function saveProfileEdits() {
    saveProfile({
      id: profile?.id ?? genId(),
      name: name.trim() || "You",
      focusAreas,
      targetDays,
      reminderTime: profile?.reminderTime ?? "20:00",
      theme: data.settings.theme,
      onboardingComplete: true,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
      startDate: profile?.startDate ?? todayStr(),
      motivation: motivation.trim() || undefined,
    });
    showToast("Profile updated");
    setEditingProfile(false);
  }

  function handleExport() {
    try {
      downloadExport(userId);
      showToast("Data exported");
    } catch {
      showToast("Export failed. Please try again.", "warning");
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Manage your profile, appearance, and data.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] shrink-0">
              <UserIcon size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold">Account</h2>
              <p className="text-sm text-[var(--muted)] truncate">
                {account?.email ? account.email : "Guest session on this device"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<LogOut size={14} />} onClick={() => setSignOutOpen(true)}>
            Sign out
          </Button>
        </div>
        {!account?.email && (
          <p className="text-xs text-[var(--muted)] mt-4 leading-relaxed">
            You're browsing as a guest. Guest data lives only on this device and can be overwritten.{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="focus-ring text-[var(--primary)] font-medium underline underline-offset-2"
            >
              Create an account
            </button>{" "}
            to keep it separate and easy to come back to.
          </p>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold">Profile</h2>
          {!editingProfile && (
            <button
              onClick={startEditing}
              className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] px-2 py-1 rounded-lg hover:bg-[var(--surface-2)]"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>
        <p className="text-sm text-[var(--muted)] mb-4">Your local profile information.</p>

        {!editingProfile ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Name</p>
                <p className="font-medium">{profile?.name ?? "You"}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Started on</p>
                <p className="font-medium">{profile ? new Date(profile.startDate).toLocaleDateString() : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Target</p>
                <p className="font-medium">{profile?.targetDays ?? "—"} days</p>
              </div>
            </div>

            {profile?.focusAreas && profile.focusAreas.length > 0 && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-2">Focus areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.focusAreas.map((id) => {
                    const opt = FOCUS_OPTIONS.find((f) => f.id === id);
                    return opt ? (
                      <span key={id} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                        {opt.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-[var(--muted)] mb-1.5">Why this matters to you</p>
              <p className="text-sm bg-[var(--surface-2)] rounded-xl p-3 leading-relaxed">
                {profile?.motivation || "Add a personal reminder — it will show up when you use Urge Mode."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label htmlFor="p-name" className="text-sm font-medium mb-2 block">Name</label>
              <input
                id="p-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
              />
            </div>
            <div>
              <label htmlFor="p-target" className="text-sm font-medium mb-2 block">Target (days)</label>
              <input
                id="p-target"
                type="number"
                min={1}
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="focus-ring w-full sm:w-40 px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
              />
            </div>
            <fieldset>
              <legend className="text-sm font-medium mb-2">Focus areas</legend>
              <div className="flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map((opt) => {
                  const active = focusAreas.includes(opt.id);
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => toggleFocus(opt.id)}
                      aria-pressed={active}
                      className={`focus-ring inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                        active ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      {active && <Check size={12} />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div>
              <label htmlFor="p-motivation" className="text-sm font-medium mb-2 block">Why this matters to you</label>
              <textarea
                id="p-motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={3}
                placeholder="A personal reminder for difficult moments..."
                className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm resize-none"
              />
              <p className="text-xs text-[var(--muted)] mt-1.5">Shown to you during Urge Mode as a grounding reminder.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setEditingProfile(false)}>Cancel</Button>
              <Button fullWidth onClick={saveProfileEdits}>Save profile</Button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-1">Appearance</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Choose how REBOOT looks.</p>
        <div className="grid grid-cols-3 gap-2.5 max-w-sm">
          {(["dark", "light", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`focus-ring py-2.5 rounded-xl border text-sm font-medium capitalize transition-colors ${
                data.settings.theme === t ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--blue)]/10 flex items-center justify-center text-[var(--blue)] shrink-0">
            <ShieldHalf size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Streak protection</h2>
                <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                  Life happens. When enabled, one untracked day is forgiven per streak instead of
                  resetting your progress to zero.
                </p>
              </div>
              <Switch
                checked={data.settings.streakProtection}
                onChange={(v) => {
                  updateSettings({ streakProtection: v });
                  showToast(v ? "Streak protection enabled" : "Streak protection disabled", "info");
                }}
                label="Toggle streak protection"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-1">Notifications</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Local reminders stored on this device.</p>
        <div className="space-y-1">
          <ReminderRow
            label="Daily check-in"
            enabled={data.settings.reminders.dailyCheckIn.enabled}
            time={data.settings.reminders.dailyCheckIn.time}
            onToggle={(enabled) => updateSettings({ reminders: { ...data.settings.reminders, dailyCheckIn: { ...data.settings.reminders.dailyCheckIn, enabled } } })}
            onTimeChange={(time) => updateSettings({ reminders: { ...data.settings.reminders, dailyCheckIn: { ...data.settings.reminders.dailyCheckIn, time } } })}
          />
          <ReminderRow
            label="Habit reminder"
            enabled={data.settings.reminders.habitReminder.enabled}
            time={data.settings.reminders.habitReminder.time}
            onToggle={(enabled) => updateSettings({ reminders: { ...data.settings.reminders, habitReminder: { ...data.settings.reminders.habitReminder, enabled } } })}
            onTimeChange={(time) => updateSettings({ reminders: { ...data.settings.reminders, habitReminder: { ...data.settings.reminders.habitReminder, time } } })}
          />
          <ReminderRow
            label="Evening reflection"
            enabled={data.settings.reminders.eveningReflection.enabled}
            time={data.settings.reminders.eveningReflection.time}
            onToggle={(enabled) => updateSettings({ reminders: { ...data.settings.reminders, eveningReflection: { ...data.settings.reminders.eveningReflection, enabled } } })}
            onTimeChange={(time) => updateSettings({ reminders: { ...data.settings.reminders, eveningReflection: { ...data.settings.reminders.eveningReflection, time } } })}
          />
          <ReminderRow
            label="Goal reminder"
            enabled={data.settings.reminders.goalReminder.enabled}
            time={data.settings.reminders.goalReminder.time}
            onToggle={(enabled) => updateSettings({ reminders: { ...data.settings.reminders, goalReminder: { ...data.settings.reminders.goalReminder, enabled } } })}
            onTimeChange={(time) => updateSettings({ reminders: { ...data.settings.reminders, goalReminder: { ...data.settings.reminders.goalReminder, time } } })}
          />
        </div>
      </Card>

      <Card className="flex gap-3 items-start bg-[var(--surface-2)]">
        <Lock size={18} className="text-[var(--primary)] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Your data stays on this device.</p>
          <p className="text-xs text-[var(--muted)] mt-1">No analytics, no tracking, no third-party services.</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-1">Data</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Export, reset, or clear your local data.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>
            Export data (JSON)
          </Button>
          <Button variant="outline" icon={<RotateCcw size={16} />} onClick={() => setResetDemoOpen(true)}>
            Reset demo data
          </Button>
          <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setDeleteOpen(true)}>
            Delete all data
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-[var(--muted)] justify-center pb-4">
        <ShieldCheck size={14} />
        REBOOT — private, local-first personal progress tracking.
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete all data"
        description="This permanently deletes your profile, check-ins, habits, journal, goals, and all history from this device. This can't be undone."
        confirmLabel="Delete everything"
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          resetAllData();
          showToast("All data deleted", "info");
          setDeleteOpen(false);
        }}
      />

      <ConfirmDialog
        open={resetDemoOpen}
        title="Reset demo data"
        description="This replaces your current data with a fresh set of realistic demo data (about 78 days of history)."
        confirmLabel="Reset with demo data"
        onCancel={() => setResetDemoOpen(false)}
        onConfirm={() => {
          loadDemoData();
          showToast("Demo data loaded");
          setResetDemoOpen(false);
        }}
      />

      <ConfirmDialog
        open={signOutOpen}
        title="Sign out"
        description="Your data stays saved on this device. You can sign back in any time."
        confirmLabel="Sign out"
        onCancel={() => setSignOutOpen(false)}
        onConfirm={() => {
          signOut();
          navigate("/sign-in");
        }}
      />
    </div>
  );
}

function ReminderRow({
  label,
  enabled,
  time,
  onToggle,
  onTimeChange,
}: {
  label: string;
  enabled: boolean;
  time: string;
  onToggle: (v: boolean) => void;
  onTimeChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <Switch checked={enabled} onChange={onToggle} label={`Toggle ${label}`} />
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      <input
        type="time"
        value={time}
        disabled={!enabled}
        onChange={(e) => onTimeChange(e.target.value)}
        aria-label={`${label} time`}
        className="focus-ring shrink-0 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm disabled:opacity-40"
      />
    </div>
  );
}
