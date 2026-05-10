"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  status: "pending" | "completed";
  recurring_task_id?: string | null;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, status: "pending" | "completed") => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

export function TaskCard({ task, onToggle, onDelete, onEdit, style, readOnly }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleEditSubmit() {
    if (readOnly) return;
    if (editValue.trim() && editValue !== task.title) {
      onEdit(task.id, editValue.trim());
    }
    setEditing(false);
  }

  function handleDelete() {
    if (readOnly) return;
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 300);
  }

  const completed = task.status === "completed";

  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 shadow-lg backdrop-blur-md"
      style={{
        ...style,
        background: completed
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(20, 20, 20, 0.8)",
        borderColor: completed
          ? "rgba(255, 255, 255, 0.02)"
          : "rgba(255, 255, 255, 0.05)",
        opacity: isDeleting ? 0 : completed ? 0.6 : 1,
        transform: isDeleting ? "translateX(20px)" : "translateX(0)",
      }}
    >
      {/* Checkbox */}
      <button
        id={`task-toggle-${task.id}`}
        disabled={readOnly}
        onClick={() => onToggle(task.id, completed ? "pending" : "completed")}
        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: completed ? "oklch(0.769 0.188 70.08)" : "rgba(255, 255, 255, 0.2)",
          background: completed ? "oklch(0.769 0.188 70.08)" : "transparent",
        }}
      >
        {completed && (
          <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        {editing && !readOnly ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit();
              if (e.key === "Escape") { setEditValue(task.title); setEditing(false); }
            }}
            className="w-full bg-input rounded-lg px-2 py-1 text-sm text-foreground border border-primary focus:outline-none"
          />
        ) : (
          <span
            className="text-sm font-medium cursor-pointer select-none block truncate"
            style={{
              color: completed ? "oklch(0.45 0.010 264)" : "oklch(0.96 0.005 264.532)",
              textDecoration: completed ? "line-through" : "none",
              cursor: readOnly ? "default" : "pointer",
            }}
            onDoubleClick={() => !readOnly && !completed && setEditing(true)}
            title={readOnly ? "" : "Double-click to edit"}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Routine badge */}
      {task.recurring_task_id && (
        <span
          className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-muted-foreground/50 tracking-widest"
        >
          ROUTINE
        </span>
      )}

      {/* Actions */}
      {!readOnly && (
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!completed && (
            <button
              id={`task-edit-${task.id}`}
              onClick={() => setEditing(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              title="Edit task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button
            id={`task-delete-${task.id}`}
            onClick={handleDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
