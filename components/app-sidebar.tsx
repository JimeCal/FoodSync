"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  Building2,
  LogOut,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Registrar datos", href: "/dashboard/registro", icon: PlusCircle },
  { name: "Recomendacion", href: "/dashboard/recomendacion", icon: Sparkles },
  { name: "Historial", href: "/dashboard/historial", icon: History },
  { name: "Multi-local", href: "/dashboard/multilocal", icon: Building2 },
  { name: "Configuracion", href: "/dashboard/configuracion", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Image
            src="/logo.png"
            alt="FoodSync Logo"
            width={150}
            height={40}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#3D7F35] text-white"
                    : "text-muted-foreground hover:bg-[#3D7F35]/10 hover:text-[#3D7F35]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#F5841F]/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-[#F5841F]">MG</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Maria Garcia</p>
              <p className="text-xs text-muted-foreground truncate">Plan Plus</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full gap-2 border-[#3D7F35]/30 hover:bg-[#3D7F35]/10 hover:text-[#3D7F35]">
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
