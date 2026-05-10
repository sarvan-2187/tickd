"use client";

import { useEffect, useState } from "react";

interface RecurringTask {
  id: string;
  title: string;
}

export default function RecurringPage() {
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [loadingRec, setLoadingRec] = useState(true);
  const [newRecurring, setNewRecurring] = useState("");
  const [addingRec, setAddingRec] = useState(false);
  const [recError, setRecError] = useState("");

  useEffect(() => {
    fetch("/api/recurring-tasks")
      .then((r) => r.json())
      .then((d) => {
        setRecurringTasks(Array.isArray(d) ? d : []);
        setLoadingRec(false);
      })
      .catch(() => setLoadingRec(false));
  }, []);

  async function handleAddRecurring(e: React.FormEvent) {
    e.preventDefault();
    if (!newRecurring.trim()) return;
    setAddingRec(true);
    setRecError("");

    try {
      const res = await fetch("/api/recurring-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newRecurring.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRecError(data.error || "Failed to add recurring task.");
        return;
      }
      setRecurringTasks((prev) => [...prev, data]);
      setNewRecurring("");
    } catch {
      setRecError("Network error.");
    } finally {
      setAddingRec(false);
    }
  }

  async function handleDeleteRecurring(id: string) {
    try {
      setRecurringTasks((prev) => prev.filter((rt) => rt.id !== id));
      await fetch(`/api/recurring-tasks/${id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Daily Routines</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your recurring tasks. These automatically appear in your to-do list every day.
      </p>

      {/* Add form */}
      <form onSubmit={handleAddRecurring} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newRecurring}
          onChange={(e) => setNewRecurring(e.target.value)}
          placeholder="Add a new daily routine…"
          maxLength={500}
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        <button
          type="submit"
          disabled={addingRec || !newRecurring.trim()}
          className="px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
            color: "oklch(0.10 0.006 285.885)",
            boxShadow: newRecurring.trim() ? "0 4px 16px oklch(0.769 0.188 70.08 / 0.3)" : "none",
          }}
        >
          {addingRec ? "Adding…" : "+ Add Routine"}
        </button>
      </form>

      {recError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6 animate-fade-in">
          {recError}
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {loadingRec ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : recurringTasks.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: "oklch(0.769 0.188 70.08 / 0.1)" }}
            >
              <svg className="w-8 h-8" style={{ color: "oklch(0.769 0.188 70.08)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm font-medium">No routines yet</p>
            <p className="text-muted-foreground text-xs mt-1">Add your first daily routine above.</p>
          </div>
        ) : (
          recurringTasks.map((rt) => (
            <div
              key={rt.id}
              className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary flex-shrink-0">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">{rt.title}</span>
              </div>
              <button
                onClick={() => handleDeleteRecurring(rt.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                title="Remove routine"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
