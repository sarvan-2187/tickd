"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  seconds: number;
  onExpire?: () => void;
  onReset?: (resetFn: () => void) => void;
}

export function CountdownTimer({ seconds, onExpire, onReset }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  function reset() {
    setRemaining(seconds);
  }

  useEffect(() => {
    onReset?.(reset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isLow = remaining <= 60;
  const pct = (remaining / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular progress */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="oklch(0.25 0.010 285.885)" strokeWidth="4"/>
          <circle
            cx="32" cy="32" r="28" fill="none" strokeWidth="4"
            stroke={isLow ? "oklch(0.704 0.191 22.216)" : "oklch(0.769 0.188 70.08)"}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums"
          style={{ color: isLow ? "oklch(0.704 0.191 22.216)" : "oklch(0.769 0.188 70.08)" }}
        >
          {mins}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {remaining <= 0 ? "Code expired" : "Code expires in"}
      </p>
    </div>
  );
}
