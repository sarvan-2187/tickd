import React from "react";
import Link from "next/link";
import { ArrowLeft, Book, Shield, Zap, RefreshCw, Mail } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-50" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: "radial-gradient(#F80 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}
        />
      </div>

      <nav className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-lg" style={{ background: "#F80" }}>
            <img src="/apple-touch-icon.png" alt="Tickd Logo" className="w-full h-full object-cover rounded-md" />
          </div>
          <span className="font-bold text-lg tracking-tight font-serif">Tickd Docs</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-serif">Documentation</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about mastering your day with Tickd.
          </p>
        </header>

        <div className="grid gap-12">
          {/* Getting Started */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-serif">Getting Started</h2>
            </div>
            <div className="glass rounded-3xl p-8 space-y-4">
              <p className="text-muted-foreground">
                Tickd uses passwordless authentication via Google SMTP. To get started, simply enter your Gmail address. We&apos;ll send you a 6-digit verification code to securely sign you in.
              </p>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 font-mono text-sm text-amber-500/80">
                1. Enter Gmail → 2. Receive OTP → 3. Start Ticking
              </div>
            </div>
          </section>

          {/* Automated Routines */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <RefreshCw className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-serif">Automated Routines</h2>
            </div>
            <div className="glass rounded-3xl p-8 space-y-4">
              <p className="text-muted-foreground">
                Routines are tasks that reset automatically every day at 00:00. Use them for habits you want to track daily, like meditation, reading, or morning standups.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Create a task and mark it as <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Routine</span></li>
                <li>When completed, it stays checked until midnight</li>
                <li>At 00:00, all Routine tasks uncheck themselves automatically</li>
              </ul>
            </div>
          </section>

          {/* Nightly Summaries */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Mail className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-serif">Nightly Summaries</h2>
            </div>
            <div className="glass rounded-3xl p-8 space-y-4">
              <p className="text-muted-foreground">
                Tickd sends you a beautiful report of your progress every night at 23:59. To enable this, you must configure your SMTP settings in the dashboard.
              </p>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-500 font-medium">
                  Note: You&apos;ll need a Google App Password to enable automated email reports.
                </p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Shield className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-serif">Security & Encryption</h2>
            </div>
            <div className="glass rounded-3xl p-8 space-y-4">
              <p className="text-muted-foreground">
                We take your security seriously. Your App Passwords are never stored in plain text. We use industry-standard <span className="text-foreground font-semibold">AES-256-GCM</span> encryption at rest.
              </p>
              <p className="text-muted-foreground">
                Encryption keys are stored securely and separated from the database, ensuring your credentials remain private even in the event of a data breach.
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-12 border-t border-white/10 text-center">
          <p className="text-muted-foreground text-sm">
            Still have questions? <Link href="/contact" className="text-amber-500 hover:underline">Contact Support</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
