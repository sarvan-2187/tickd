"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // Store email in session storage for verify page
      sessionStorage.setItem("otp_email", email);
      router.push("/verify");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, oklch(0.769 0.188 70.08 / 0.12), transparent)",
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.96 0.005 264.532) 1px, transparent 1px), linear-gradient(90deg, oklch(0.96 0.005 264.532) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
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

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl flex-shrink-0 mb-6 shadow-lg"
            style={{ background: "#F80" }}>
            <img src="/apple-touch-icon.png" alt="Tickd Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Tickd</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Stay on top of your day, every day.
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8 glow-amber">
          <h2 className="text-lg font-semibold text-foreground mb-1">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your Gmail to receive a verification code.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Gmail Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                autoFocus
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
                {error}
              </div>
            )}

            <button
              id="send-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "oklch(0.666 0.179 58.318)"
                  : "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
                color: "oklch(0.10 0.006 285.885)",
                boxShadow: loading ? "none" : "0 4px 24px oklch(0.769 0.188 70.08 / 0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending code…
                </span>
              ) : (
                "Send verification code →"
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            A 6-digit OTP will be sent to your inbox. No password needed.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Secured with OTP authentication & end-to-end encryption
        </p>
      </div>
    </main>
  );
}
