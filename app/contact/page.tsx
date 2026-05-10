"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        // We could display the specific error message here if we wanted
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
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
          <span className="font-bold text-lg tracking-tight font-serif">Tickd</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-medium mb-6 font-sans">
            <MessageSquare className="w-3 h-3" />
            Contact Support
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-serif">Get in touch</h1>
          <p className="text-muted-foreground text-lg">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
        </motion.div>

        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-12 text-center flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif">Message Sent!</h2>
            <p className="text-muted-foreground">
              Thank you for reaching out. We&apos;ll get back to you as soon as possible.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-4 text-amber-500 font-semibold hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 md:p-10 border border-white/5 space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground ml-1">Name</label>
              <input
                required
                type="text"
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-muted-foreground/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">Email</label>
              <input
                required
                type="email"
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-muted-foreground/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground ml-1">Message</label>
              <textarea
                required
                id="message"
                rows={5}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
              />
            </div>

            <button
              disabled={status === "loading"}
              type="submit"
              className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, oklch(0.828 0.189 84.429), oklch(0.666 0.179 58.318))",
                color: "oklch(0.10 0.006 285.885)",
                boxShadow: "0 8px 32px oklch(0.769 0.188 70.08 / 0.2)",
              }}
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-destructive text-sm text-center font-medium">
                Something went wrong. Please try again.
              </p>
            )}
          </motion.form>
        )}
      </main>
    </div>
  );
}
