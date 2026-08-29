import type { AppData } from "../types";

const STORAGE_PREFIX = "reboot:data:";
const CURRENT_VERSION = 1;

function storageKeyFor(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export function defaultAppData(): AppData {
  return {
    version: CURRENT_VERSION,
    profile: null,
    checkIns: [],
    habits: [],
    habitLogs: [],
    relapses: [],
    urgeSessions: [],
    journal: [],
    goals: [],
    achievements: [],
    settings: {
      theme: "dark",
      streakProtection: false,
      reminders: {
        dailyCheckIn: { enabled: true, time: "20:00" },
        habitReminder: { enabled: true, time: "08:00" },
        eveningReflection: { enabled: false, time: "21:30" },
        goalReminder: { enabled: false, time: "09:00" },
      },
    },
  };
}

function migrate(data: any): AppData {
  // Placeholder for future migrations when version increments.
  if (!data.version) data.version = CURRENT_VERSION;
  const fallback = defaultAppData();
  return { ...fallback, ...data, settings: { ...fallback.settings, ...(data.settings || {}) } };
}

export function getItem(userId: string): AppData {
  try {
    const raw = window.localStorage.getItem(storageKeyFor(userId));
    if (!raw) return defaultAppData();
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch (err) {
    console.error("REBOOT storage: failed to read localStorage, resetting.", err);
    return defaultAppData();
  }
}

export function setItem(userId: string, data: AppData): boolean {
  try {
    window.localStorage.setItem(storageKeyFor(userId), JSON.stringify(data));
    return true;
  } catch (err) {
    console.error("REBOOT storage: failed to write localStorage.", err);
    return false;
  }
}

export function removeItem(userId: string): void {
  try {
    window.localStorage.removeItem(storageKeyFor(userId));
  } catch (err) {
    console.error("REBOOT storage: failed to remove localStorage.", err);
  }
}

export function clearAppData(userId: string): AppData {
  removeItem(userId);
  return defaultAppData();
}

export function exportAppData(userId: string): string {
  const data = getItem(userId);
  return JSON.stringify(data, null, 2);
}

export function downloadExport(userId: string): void {
  const json = exportAppData(userId);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reboot-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
