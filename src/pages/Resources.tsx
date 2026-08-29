import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";
import Card from "../components/ui/Card";
import { RESOURCES, RESPONSIBLE_USE_NOTE } from "../data/defaults";

const CATEGORIES = [
  "Urge Management",
  "Habit Building",
  "Sleep",
  "Focus",
  "Stress",
  "Digital Wellbeing",
  "Self Reflection",
];

export default function Resources() {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => (active ? RESOURCES.filter((r) => r.category === active) : RESOURCES), [active]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Practical, grounded reading for the moments that matter.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={`focus-ring px-3.5 py-2 rounded-full text-xs font-medium border ${!active ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--muted)]"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`focus-ring px-3.5 py-2 rounded-full text-xs font-medium border ${active === c ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--muted)]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.title}>
            <span className="text-[11px] font-medium text-[var(--primary)] uppercase tracking-wide">{r.category}</span>
            <h3 className="font-medium text-sm mt-2">{r.title}</h3>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{r.body}</p>
          </Card>
        ))}
      </div>

      <Card className="flex gap-3 items-start bg-[var(--surface-2)]">
        <Info size={18} className="text-[var(--blue)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--muted)] leading-relaxed">{RESPONSIBLE_USE_NOTE}</p>
      </Card>
    </div>
  );
}
