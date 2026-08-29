import React from "react";
import { Moon, Sun, ShieldCheck } from "lucide-react";
import { useSettings } from "../hooks";

export default function TopBar() {
  const { settings, updateSettings } = useSettings();
  const isDark = settings.theme === "dark" || (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-30">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <ShieldCheck size={15} className="text-black" />
        </div>
        <span className="font-semibold tracking-tight">REBOOT</span>
      </div>
      <button
        onClick={() => updateSettings({ theme: isDark ? "light" : "dark" })}
        aria-label="Toggle theme"
        className="focus-ring p-2 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
