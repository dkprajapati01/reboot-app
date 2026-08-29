import React from "react";
import * as Icons from "lucide-react";
import { Lock } from "lucide-react";
import { format } from "date-fns";
import type { Achievement } from "../../types";

const CATEGORY_COLOR: Record<Achievement["category"], string> = {
  consistency: "var(--primary)",
  awareness: "var(--blue)",
  habits: "var(--amber)",
  intervention: "var(--red)",
  journaling: "#A78BFA",
};

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = (Icons as any)[achievement.icon] || Icons.Trophy;
  const unlocked = !!achievement.unlockedAt;
  const color = CATEGORY_COLOR[achievement.category];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        unlocked ? "border-[var(--border)] bg-[var(--surface)] animate-pop" : "border-[var(--border)] bg-[var(--surface)] opacity-50"
      }`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: unlocked ? `${color}1a` : "var(--surface-2)", color: unlocked ? color : "var(--muted)" }}
      >
        {unlocked ? <Icon size={22} /> : <Lock size={18} />}
      </div>
      <h3 className="font-medium text-sm">{achievement.title}</h3>
      <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{achievement.description}</p>
      {unlocked && achievement.unlockedAt && (
        <p className="text-[11px] text-[var(--muted)] mt-3">Unlocked {format(new Date(achievement.unlockedAt), "MMM d, yyyy")}</p>
      )}
    </div>
  );
}
