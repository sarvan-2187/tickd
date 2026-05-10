import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500/30">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-50" />
      </div>

      <nav className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 font-serif font-bold text-lg">
          <Shield className="w-5 h-5 text-amber-500" />
          Tickd Privacy
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-serif">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: May 10, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">1. Data Collection</h2>
            <p>
              Tickd collects minimal personal information necessary to provide our services. This includes your email address for authentication and task data you explicitly create within the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">2. Encryption</h2>
            <p>
              We prioritize your security. Sensitive credentials, such as App Passwords used for SMTP reports, are encrypted using AES-256-GCM before being stored in our database.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">3. Third-Party Services</h2>
            <p>
              We use Neon for database hosting and Google SMTP for email delivery. These providers have their own privacy policies which govern how they handle your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">4. Data Retention</h2>
            <p>
              Your tasks and account data are retained as long as your account is active. You may request account deletion at any time via our contact support.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
