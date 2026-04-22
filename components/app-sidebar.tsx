"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  History,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { platformRoleLabels, type PlatformPermission } from "@/lib/role-permissions";
import { usePlatformSession } from "@/lib/platform-session";
import { useUser } from "@/lib/user-context";

const navigation: Array<{
  feature?: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  name: string;
  permission: PlatformPermission;
}> = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "viewDashboard" },
  { name: "Registrar datos", href: "/dashboard/registro", icon: PlusCircle, permission: "manageRecords" },
  {
    name: "Recomendacion",
    href: "/dashboard/recomendacion",
    icon: Sparkles,
    permission: "viewRecommendations",
  },
  {
    name: "Historial",
    href: "/dashboard/historial",
    icon: History,
    permission: "viewHistory",
    feature: "historicalData",
  },
  {
    name: "Multi-local",
    href: "/dashboard/multilocal",
    icon: Building2,
    permission: "viewMultilocal",
    feature: "multiLocation",
  },
  { name: "Equipo", href: "/dashboard/equipo", icon: Users, permission: "manageTeam" },
  {
    name: "Configuracion",
    href: "/dashboard/configuracion",
    icon: Settings,
    permission: "manageSettings",
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasPermission, logout, session } = usePlatformSession();
  const { hasFeature, user } = useUser();

  const visibleNavigation = navigation.filter(
    (item) => hasPermission(item.permission) && (!item.feature || hasFeature(item.feature)),
  );

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Image
            src="/logo.png"
            alt="FoodSync Logo"
            width={150}
            height={40}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#3D7F35] text-white"
                    : "text-muted-foreground hover:bg-[#3D7F35]/10 hover:text-[#3D7F35]",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5841F]/20">
              <span className="text-sm font-semibold text-[#F5841F]">
                {getInitials(user.name)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {session?.title || platformRoleLabels[user.role]} - Plan {user.plan}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-[#3D7F35]/30 hover:bg-[#3D7F35]/10 hover:text-[#3D7F35]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </Button>
        </div>
      </div>
    </aside>
  );
}
