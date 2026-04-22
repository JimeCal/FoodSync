"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { UserProvider } from "@/lib/user-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        {/* Main Content */}
        <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </UserProvider>
  );
}
