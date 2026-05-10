"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [appPassword, setAppPassword] = useState("");
  const [hasAppPassword, setHasAppPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.hasAppPassword) setHasAppPassword(true);
        if (d.email) setEmail(d.email);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/settings/app-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save App Password.");
        return;
      }
      setHasAppPassword(true);
      setAppPassword("");
      setSuccess("App Password verified and saved. A confirmation email was sent to you.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setError("");
    setSuccess("");
    setRemoving(true);

    try {
      const res = await fetch("/api/settings/app-password", { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to remove App Password.");
        return;
      }
      setHasAppPassword(false);
      setSuccess("App Password removed. Nightly reports are now disabled.");
    } catch {
      setError("Network error.");
    } finally {
      setRemoving(false);
    }
  }

  const displayName = email ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1).replace(/[^a-zA-Z0-9]/g, ' ') : "User Profile";

  return (
    <div className="animate-slide-up max-w-lg">
      <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Configure your email reporting preferences and profile.
      </p>

      {/* Profile Card */}
      <div
        className="rounded-2xl border p-6 mb-6 flex items-center gap-4"
        style={{ background: "oklch(0.135 0.008 285.885)", borderColor: "oklch(0.25 0.010 285.885)" }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-black flex-shrink-0"
             style={{ background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))" }}>
          {email ? email.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-foreground truncate capitalize">{displayName}</h2>
          <p className="text-sm text-muted-foreground truncate">{email || "Loading..."}</p>
        </div>
      </div>

      {/* Email reporting card */}
      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ background: "oklch(0.135 0.008 285.885)", borderColor: "oklch(0.25 0.010 285.885)" }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.769 0.188 70.08 / 0.15)" }}
          >
            <svg className="w-5 h-5" style={{ color: "oklch(0.769 0.188 70.08)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-0.5">Nightly Email Reports</h2>
            <p className="text-sm text-muted-foreground">
              Receive an automated summary of your day at 23:59 via your Gmail account.
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
          style={{
            background: hasAppPassword
              ? "oklch(0.769 0.188 70.08 / 0.08)"
              : "oklch(0.704 0.191 22.216 / 0.08)",
            border: `1px solid ${hasAppPassword ? "oklch(0.769 0.188 70.08 / 0.25)" : "oklch(0.704 0.191 22.216 / 0.25)"}`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: hasAppPassword
                ? "oklch(0.769 0.188 70.08)"
                : "oklch(0.704 0.191 22.216)",
            }}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: hasAppPassword
                ? "oklch(0.769 0.188 70.08)"
                : "oklch(0.704 0.191 22.216)",
            }}
          >
            {hasAppPassword ? "Email reporting enabled" : "Email reporting disabled"}
          </span>
        </div>

        {/* App Password form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="app-password-input" className="block text-sm font-medium text-foreground mb-1.5">
              Gmail App Password
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              A 16-character App Password from your{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
                style={{ color: "oklch(0.769 0.188 70.08)" }}
              >
                Google Account settings
              </a>
              . Format: <code className="text-xs px-1 py-0.5 rounded bg-secondary">xxxx xxxx xxxx xxxx</code>
            </p>
            <div className="relative">
              <input
                id="app-password-input"
                type={showPassword ? "text" : "password"}
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                maxLength={19}
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div
              className="rounded-xl border px-4 py-3 text-sm animate-fade-in"
              style={{
                borderColor: "oklch(0.769 0.188 70.08 / 0.3)",
                background: "oklch(0.769 0.188 70.08 / 0.08)",
                color: "oklch(0.769 0.188 70.08)",
              }}
            >
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <button
              id="save-app-password-btn"
              type="submit"
              disabled={saving || !appPassword.trim()}
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
                color: "oklch(0.10 0.006 285.885)",
                boxShadow: appPassword.trim() ? "0 4px 16px oklch(0.769 0.188 70.08 / 0.3)" : "none",
              }}
            >
              {saving ? "Verifying & saving…" : hasAppPassword ? "Update App Password" : "Save & verify"}
            </button>

            {hasAppPassword && (
              <button
                id="remove-app-password-btn"
                type="button"
                onClick={handleRemove}
                disabled={removing}
                className="px-4 rounded-xl text-sm font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
              >
                {removing ? "Removing…" : "Remove"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Info cards */}
      <div className="space-y-3">
        <div
          className="rounded-xl p-4 flex gap-3"
          style={{ background: "oklch(0.135 0.008 285.885)", border: "1px solid oklch(0.25 0.010 285.885)" }}
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.769 0.188 70.08)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground mb-0.5">End-to-end encrypted</p>
            <p className="text-xs text-muted-foreground">
              Your App Password is encrypted with AES-256-GCM before storage. It is never stored in plaintext and only decrypted in-memory during email dispatch.
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex gap-3"
          style={{ background: "oklch(0.135 0.008 285.885)", border: "1px solid oklch(0.25 0.010 285.885)" }}
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.769 0.188 70.08)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground mb-0.5">Nightly at 23:59</p>
            <p className="text-xs text-muted-foreground">
              An automated summary of your day&apos;s tasks — completed and pending — is emailed to you every night at 23:59 IST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
