"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  History,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { usePlatformSession } from "@/lib/platform-session";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";
import type { PlatformPermission } from "@/lib/role-permissions";

const navigation: Array<{
  feature?: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  name: string;
  permission: PlatformPermission;
}> = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard, permission: "viewDashboard" },
  { name: "Registrar", href: "/dashboard/registro", icon: PlusCircle, permission: "manageRecords" },
  {
    name: "IA",
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
    name: "Locales",
    href: "/dashboard/multilocal",
    icon: Building2,
    permission: "viewMultilocal",
    feature: "multiLocation",
  },
  { name: "Equipo", href: "/dashboard/equipo", icon: Users, permission: "manageTeam" },
  {
    name: "Ajustes",
    href: "/dashboard/configuracion",
    icon: Settings,
    permission: "manageSettings",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { hasPermission } = usePlatformSession();
  const { hasFeature } = useUser();

  const visibleNavigation = navigation.filter(
    (item) => hasPermission(item.permission) && (!item.feature || hasFeature(item.feature)),
  );

  return (
    <nav className="safe-area-inset-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
      <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5">
        {visibleNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex min-w-[72px] flex-1 shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors",
                isActive ? "text-[#3D7F35]" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-[#3D7F35]")} />
              <span className="truncate text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
