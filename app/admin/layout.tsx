"use client";

import { AdminProvider } from "@/lib/admin-context";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin-sidebar";
import { PermissionGate } from "@/components/permission-gate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGate requireAdmin>
      <AdminProvider>
        <div className="min-h-screen bg-muted/20">
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>

          <main className="min-h-screen pb-20 lg:pl-72 lg:pb-0">
            {children}
          </main>

          <AdminMobileNav />
        </div>
      </AdminProvider>
    </PermissionGate>
  );
}
