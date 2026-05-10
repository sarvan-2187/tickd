"use client";

import { useEffect } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { Book } from "lucide-react";

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background glow effects */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 0%, oklch(0.769 0.188 70.08 / 0.15), transparent 60%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.96 0.005 264.532) 1px, transparent 1px), linear-gradient(90deg, oklch(0.96 0.005 264.532) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center shadow-lg"
            style={{ background: "#F80" }}
          >
            <img src="/apple-touch-icon.png" alt="Tickd Logo" className="w-full h-full object-cover rounded-md" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-amber-500 transition-colors">Tickd</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
              color: "oklch(0.10 0.006 285.885)",
              boxShadow: "0 4px 16px oklch(0.769 0.188 70.08 / 0.2)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-20 animate-slide-up">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Master your day, <br className="hidden md:block" />
            <span className="text-gradient font-heading italic pr-4">every single day.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A secure, distraction-free task manager that sends you automated nightly summaries so you can wake up ready to focus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
                color: "oklch(0.10 0.006 285.885)",
                boxShadow: "0 4px 16px oklch(0.769 0.188 70.08 / 0.2)",
              }}
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold transition-all border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Book className="w-4 h-4 text-amber-500" />
              Read Docs
            </Link>
          </div>
        </div>

        {/* Mockup Preview */}
        <div className="mt-24 w-full max-w-5xl mx-auto relative group perspective-[2000px]">
          {/* Glowing backplate */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-900 rounded-[32px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <motion.div
            initial={{ rotateX: 15, y: 40, opacity: 0 }}
            whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative glass rounded-[24px] border border-white/10 overflow-hidden shadow-2xl flex flex-col"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
            }}
          >
            {/* Mac Title Bar */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-black/60 flex-shrink-0 relative z-20">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
            </div>

            {/* App Layout */}
            <div className="flex h-[600px] bg-background/60 backdrop-blur-3xl relative z-10">

              {/* Sidebar Mockup */}
              <div className="hidden md:flex w-64 border-r border-white/5 flex-col p-6 gap-6 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center shadow-lg" style={{ background: "#F80" }}>
                    <img src="/apple-touch-icon.png" alt="Logo" className="w-full h-full object-cover rounded" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-foreground">Tickd</span>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="px-3 py-2.5 rounded-xl bg-amber-500/15 text-amber-500 text-sm font-medium flex items-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                    Tasks
                  </div>
                  <div className="px-3 py-2.5 rounded-xl text-muted-foreground text-sm font-medium flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Routines
                  </div>
                  <div className="px-3 py-2.5 rounded-xl text-muted-foreground text-sm font-medium flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </div>
                </div>
              </div>

              {/* Main Content Mockup */}
              <div className="flex-1 p-8 overflow-hidden flex flex-col relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-2xl mx-auto w-full relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Today</p>
                      <h2 className="text-3xl font-bold text-foreground">May 10, 2026</h2>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-sm font-bold" style={{ color: "oklch(0.769 0.188 70.08)" }}>66%</span>
                      <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "66%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add Task Input Mock */}
                  <div className="flex gap-3 mb-10">
                    <div className="flex-1 rounded-xl border border-white/10 bg-card/50 px-5 py-4 flex items-center text-muted-foreground text-sm shadow-sm">
                      Add a new task...
                    </div>
                    <div className="px-6 py-4 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-semibold text-sm flex items-center justify-center shadow-lg shadow-amber-500/20">
                      + Add
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div
                    className="space-y-8 flex-1 overflow-hidden"
                    style={{ WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)", maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
                  >

                    {/* Pending */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-4">Pending</p>

                      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-card/80 shadow-lg backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                        <div className="text-sm font-medium text-foreground">Write implementation plan for Q3</div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-card/80 shadow-lg backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                        <div className="text-sm font-medium text-foreground">Sync with design team on new UI</div>
                        <div className="ml-auto text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/80 text-muted-foreground font-bold">Routine</div>
                      </motion.div>
                    </div>

                    {/* Completed */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-4">Completed</p>

                      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-card/30 shadow-sm opacity-60">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full border-2 border-amber-500 bg-amber-500 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground line-through">Review morning pull requests</div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-card/30 shadow-sm opacity-60">
                        <div className="w-6 h-6 flex-shrink-0 rounded-full border-2 border-amber-500 bg-amber-500 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground line-through">Daily standup meeting</div>
                        <div className="ml-auto text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground/70 font-bold">Routine</div>
                      </motion.div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Built for focus and security</h2>
          <p className="text-muted-foreground">Everything you need to track your day, nothing you don't.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="glass rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Passwordless</h3>
            <p className="text-sm text-muted-foreground">
              Securely authenticate using a fast, one-time OTP sent directly to your Gmail.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Routines</h3>
            <p className="text-sm text-muted-foreground">
              Set recurring tasks that automatically reset every day, keeping your habits consistent.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Summaries</h3>
            <p className="text-sm text-muted-foreground">
              Receive an automated email every day at 23:59 summarizing your task progress.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Encryption</h3>
            <p className="text-sm text-muted-foreground">
              Your App Passwords are AES-256 encrypted at rest. We prioritize your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 w-full max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-foreground mb-4 tracking-tight font-serif"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Quick answers to common questions about Tickd.
          </motion.p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What is Tickd?",
              a: "Tickd is a focused daily task manager designed for high-performance individuals. It combines secure, passwordless authentication with automated features like daily routines and nightly email summaries."
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. We use bank-grade AES-256-GCM encryption for all sensitive data at rest. Your App Passwords and credentials are never stored in plain text."
            },
            {
              q: "How do Routines work?",
              a: "Routines are tasks that automatically reset every day at midnight. Simply mark a task as a routine, and it will be fresh and unchecked every morning, helping you maintain consistent habits."
            },
            {
              q: "What are Nightly Summaries?",
              a: "At 23:59 every night, Tickd sends a beautifully formatted email summarizing your progress for the day. It shows your completed tasks and anything still pending, giving you clarity before you wake up."
            },
            {
              q: "Do I need a Google account?",
              a: "Yes, Tickd uses Gmail for passwordless authentication and automated reports. You'll need a Google account and a generated App Password for full functionality."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/20 transition-colors"
            >
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none">
                  <span className="font-bold text-foreground tracking-tight">{item.q}</span>
                  <span className="text-amber-500 transition-transform duration-300 group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground animate-fade-in">
                  {item.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 backdrop-blur-xl py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-lg" style={{ background: "#F80" }}>
                  <img src="/apple-touch-icon.png" alt="Tickd Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <span className="text-xl font-bold text-foreground font-sans">Tickd</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Your secure, intelligent task companion. Master your day, every single day.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-[10px]">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/docs" className="text-muted-foreground hover:text-amber-500 transition-colors">Documentation</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-amber-500 transition-colors">Support</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-amber-500 transition-colors">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-[10px]">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-amber-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Tickd. All rights reserved. Built for focus.
            </p>
            <div className="flex items-center gap-6">
              <Link href="https://x.com/SarvanKumar2187" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Link>
              <Link href="https://github.com/sarvan-2187" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </Link>
              <Link href="https://www.sarvankumar.in" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Portfolio">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
