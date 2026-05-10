import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
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
          <Scale className="w-5 h-5 text-amber-500" />
          Tickd Terms
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-serif">Terms & Conditions</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: May 10, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Tickd, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">2. Use License</h2>
            <p>
              Tickd is provided "as is". We grant you a personal, non-transferable license to use the application for your personal task management needs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">3. Prohibited Conduct</h2>
            <p>
              Users may not use Tickd for any illegal purposes or to distribute malicious software. Abuse of the contact form or authentication system will result in permanent lockout.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-serif">4. Limitation of Liability</h2>
            <p>
              Tickd shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
