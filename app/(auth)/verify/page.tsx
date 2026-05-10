"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OTPInput } from "@/components/otp-input";
import { CountdownTimer } from "@/components/countdown-timer";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const resetTimerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("otp_email");
    if (!stored) {
      router.replace("/");
      return;
    }
    setEmail(stored);
  }, [router]);

  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleVerify() {
    if (!email || code.length < 6) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setCode("");
        return;
      }

      sessionStorage.removeItem("otp_email");
      router.push("/tasks");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setError("");
    setExpired(false);
    setCode("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend.");
        return;
      }

      setResent(true);
      resetTimerRef.current?.();
      setTimeout(() => setResent(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{3}).*(@.*)/, "$1***$2")
    : "";

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, oklch(0.769 0.188 70.08 / 0.12), transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 shadow-lg flex-shrink-0"
              style={{ background: "#F80" }}
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">Check your inbox</h1>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to<br />
              <span className="text-foreground font-medium">{maskedEmail}</span>
            </p>
          </div>

          {/* Countdown */}
          <div className="flex justify-center mb-8">
            <CountdownTimer
              seconds={300}
              onExpire={() => setExpired(true)}
              onReset={(fn) => { resetTimerRef.current = fn; }}
            />
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <OTPInput value={code} onChange={setCode} disabled={loading || expired} />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive text-center mb-4 animate-fade-in">
              {error}
            </div>
          )}

          {/* Expired notice */}
          {expired && !error && (
            <div className="rounded-xl border border-amber-600/30 bg-amber-600/10 px-4 py-3 text-sm text-amber-400 text-center mb-4 animate-fade-in">
              Code expired. Please request a new one.
            </div>
          )}

          {/* Verify button */}
          <button
            id="verify-otp-btn"
            onClick={handleVerify}
            disabled={loading || expired || code.length < 6}
            className="w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            style={{
              background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
              color: "oklch(0.10 0.006 285.885)",
              boxShadow: code.length === 6 && !expired ? "0 4px 24px oklch(0.769 0.188 70.08 / 0.35)" : "none",
            }}
          >
            {loading ? "Verifying…" : "Verify code"}
          </button>

          {/* Resend */}
          <div className="text-center">
            <button
              id="resend-otp-btn"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {resending ? "Sending…" : resent ? "✓ Code resent!" : "Didn't receive it? Resend"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
