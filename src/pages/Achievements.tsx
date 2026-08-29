import React from "react";
import { Trophy } from "lucide-react";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import AchievementCard from "../components/achievements/AchievementCard";
import { useAchievements } from "../hooks";

export default function Achievements() {
  const { achievements } = useAchievements();
  const unlocked = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Recognizing consistency, awareness, and effort.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--amber)]/10 flex items-center justify-center text-[var(--amber)] shrink-0">
            <Trophy size={22} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">{unlocked} of {achievements.length} unlocked</p>
            <ProgressBar value={(unlocked / Math.max(1, achievements.length)) * 100} color="var(--amber)" />
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((a) => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
}
