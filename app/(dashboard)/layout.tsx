"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          router.push("/");
        } else {
          setLoading(false);
        }
      })
      .catch(() => router.push("/"));
  }, [router]);

  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col relative w-full min-w-0 bg-background/60 backdrop-blur-3xl">
          <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: "linear-gradient(oklch(0.96 0.005 264.532) 1px, transparent 1px), linear-gradient(90deg, oklch(0.96 0.005 264.532) 1px, transparent 1px)", 
              backgroundSize: "40px 40px" 
            }} 
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center px-4 py-3 border-b border-white/5 relative z-20 bg-black/40 backdrop-blur-md">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" size={'icon-lg'} />
            <div className="ml-3 flex items-center gap-3">
              <span className="font-bold text-xl tracking-tight text-foreground">Tickd</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 w-full p-6 md:p-8 overflow-y-auto relative z-10">
             <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
               {children}
             </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
