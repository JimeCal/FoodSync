"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlatformSession } from "@/lib/platform-session";
import { adminNavigation } from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, session } = usePlatformSession();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <Image
              src="/logo.png"
              alt="FoodSync Logo"
              width={150}
              height={40}
              className="h-auto w-[150px]"
              priority
            />
            <Badge className="border-transparent bg-[#F5841F] text-white">Admin</Badge>
          </div>

          <div className="mt-4 rounded-2xl border border-[#3D7F35]/20 bg-[#3D7F35]/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D7F35]/15">
                <ShieldCheck className="h-5 w-5 text-[#3D7F35]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Panel interno</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Monitorea clientes, locales, credenciales y salud operativa de toda la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {adminNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                  isActive
                    ? "bg-[#3D7F35] text-white"
                    : "text-muted-foreground hover:bg-[#3D7F35]/10 hover:text-[#3D7F35]",
                )}
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className={cn("text-xs", isActive ? "text-white/80" : "text-muted-foreground")}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-4 rounded-2xl bg-muted/60 p-3">
            <p className="text-sm font-medium text-foreground">
              {session?.userName || "Equipo FoodSync"}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.title || "Modo desarrollador y operaciones internas."}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-[#3D7F35]/30 hover:bg-[#3D7F35]/10 hover:text-[#3D7F35]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Salir del panel
          </Button>
        </div>
      </div>
    </aside>
  );
}
