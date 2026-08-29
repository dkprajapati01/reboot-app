import React, { useMemo, useState } from "react";
import { Plus, Search, NotebookPen } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import JournalFormModal from "../components/journal/JournalFormModal";
import JournalCard from "../components/journal/JournalCard";
import { useJournal } from "../hooks";
import { useToast } from "../components/ui/Toast";
import type { JournalEntry, Mood } from "../types";

const TAG_OPTIONS = ["progress", "trigger", "win", "reflection", "difficult_day"];
const TAG_LABELS: Record<string, string> = {
  progress: "Progress",
  trigger: "Trigger",
  win: "Win",
  reflection: "Reflection",
  difficult_day: "Difficult Day",
};

type SortMode = "newest" | "oldest";

export default function Journal() {
  const { entries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useJournal();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");

  const filtered = useMemo(() => {
    let list = entries.filter((e) => {
      const matchesQuery =
        !query ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.body.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !tagFilter || e.tags.includes(tagFilter);
      return matchesQuery && matchesTag;
    });
    list = [...list].sort((a, b) =>
      sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    return list;
  }, [entries, query, tagFilter, sort]);

  function handleSave(vals: { date: string; mood: Mood; title: string; body: string; tags: string[] }) {
    if (editing) {
      updateJournalEntry(editing.id, vals);
      showToast("Entry updated");
    } else {
      addJournalEntry(vals);
      showToast("Entry saved");
    }
    setEditing(undefined);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
          <p className="text-[var(--muted)] mt-1 text-sm">A private space to reflect.</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          New entry
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries..."
              aria-label="Search journal entries"
              className="focus-ring w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            aria-label="Sort entries"
            className="focus-ring px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setTagFilter(null)}
            className={`focus-ring px-3 py-1.5 rounded-full text-xs font-medium border ${!tagFilter ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--muted)]"}`}
          >
            All
          </button>
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`focus-ring px-3 py-1.5 rounded-full text-xs font-medium border ${tagFilter === t ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--muted)]"}`}
            >
              {TAG_LABELS[t]}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<NotebookPen size={24} />}
            title={entries.length === 0 ? "Nothing here yet." : "No entries match your search."}
            description={entries.length === 0 ? "Start with a few words about today." : undefined}
            action={
              entries.length === 0 ? (
                <Button onClick={() => setFormOpen(true)} icon={<Plus size={16} />}>New entry</Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <JournalCard
              key={e.id}
              entry={e}
              onEdit={() => {
                setEditing(e);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(e)}
            />
          ))}
        </div>
      )}

      <JournalFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initial={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete entry"
        description="This journal entry will be permanently deleted."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteJournalEntry(deleteTarget.id);
            showToast("Entry deleted", "info");
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
