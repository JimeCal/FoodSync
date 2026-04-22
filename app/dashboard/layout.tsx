"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { PermissionGate } from "@/components/permission-gate";
import { UserProvider } from "@/lib/user-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGate>
      <UserProvider>
        <div className="min-h-screen bg-background">
          <div className="hidden lg:block">
            <AppSidebar />
          </div>

          <main className="min-h-screen pb-20 lg:pl-64 lg:pb-0">
            {children}
          </main>

          <MobileNav />
        </div>
      </UserProvider>
    </PermissionGate>
  );
}
