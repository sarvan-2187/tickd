"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TaskCard } from "@/components/task-card";
import { DatePicker } from "@/components/date-picker";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  status: "pending" | "completed";
  rollover: boolean;
  task_date: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch(`/api/tasks?date=${dateStr}`);
      if (!res.ok) return;
      const data = await res.json();
      setTasks(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setAdding(true);
    setError("");

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, task_date: dateStr }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add task.");
        return;
      }
      setTasks((prev) => [...prev, data]);
      setNewTitle("");
      inputRef.current?.focus();
    } catch {
      setError("Network error.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id: string, status: "pending" | "completed") {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  async function handleEdit(id: string, title: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }

  const completed = tasks.filter((t) => t.status === "completed");
  const pending = tasks.filter((t) => t.status === "pending");
  const pct = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
  
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const selectedStart = new Date(selectedDate);
  selectedStart.setHours(0, 0, 0, 0);
  const isPast = selectedStart < todayStart;

  return (
    <div className="animate-slide-up pb-10">
      {/* Date header + progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
           <div className="flex items-center gap-2 mb-1.5">
             <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{isToday ? "Today" : "Viewing Date"}</p>
             {isPast && (
               <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary/80 text-muted-foreground tracking-widest uppercase">
                 Read-Only
               </span>
             )}
           </div>
           <DatePicker date={selectedDate} setDate={setSelectedDate} />
         </div>
         {tasks.length > 0 && (
           <div className="flex flex-col items-end gap-2">
             <div className="flex items-center justify-between w-full min-w-[128px]">
               <span className="text-xs font-medium text-muted-foreground">{completed.length} of {tasks.length} done</span>
               <span className="text-sm font-bold" style={{ color: "oklch(0.769 0.188 70.08)" }}>{pct}%</span>
             </div>
             <div className="w-full h-2 rounded-full bg-secondary overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${pct}%` }} 
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" 
                />
             </div>
           </div>
         )}
      </div>

      {/* Add task form (hidden in past) */}
      {!isPast && (
        <form onSubmit={handleAdd} className="flex gap-3 mb-10 relative z-20">
          <input
            ref={inputRef}
            id="new-task-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task…"
            maxLength={500}
            className="flex-1 rounded-xl border border-white/10 bg-card/50 backdrop-blur-md px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          <button
            id="add-task-btn"
            type="submit"
            disabled={adding || !newTitle.trim()}
            className="px-6 py-4 rounded-xl text-black font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
            }}
          >
            {adding ? "Adding…" : "+ Add"}
          </button>
        </form>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4 animate-fade-in">
          {error}
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "oklch(0.769 0.188 70.08 / 0.1)" }}
          >
            <svg className="w-8 h-8" style={{ color: "oklch(0.769 0.188 70.08)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm font-medium">No tasks found</p>
          {!isPast && (
            <p className="text-muted-foreground text-xs mt-1">Add your first task above to get started.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Pending first */}
          {pending.length > 0 && (
            <div className="space-y-4 relative z-10">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">PENDING</p>
              {pending.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <TaskCard
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    readOnly={isPast}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-4 mt-10 relative z-10">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">COMPLETED</p>
              {completed.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <TaskCard
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    readOnly={isPast}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All done celebration */}
      {tasks.length > 0 && completed.length === tasks.length && (
        <div
          className="mt-8 text-center py-6 rounded-2xl animate-fade-in"
          style={{ background: "oklch(0.769 0.188 70.08 / 0.08)", border: "1px solid oklch(0.769 0.188 70.08 / 0.2)" }}
        >
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-semibold text-sm" style={{ color: "oklch(0.769 0.188 70.08)" }}>
            All tasks complete!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isPast ? "You crushed it on this day." : "Great work today. Your nightly report will confirm it at 23:59."}
          </p>
        </div>
      )}
    </div>
  );
}
