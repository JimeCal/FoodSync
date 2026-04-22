"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { name: "Registrar", href: "/dashboard/registro", icon: PlusCircle },
  { name: "IA", href: "/dashboard/recomendacion", icon: Sparkles },
  { name: "Historial", href: "/dashboard/historial", icon: History },
  { name: "Ajustes", href: "/dashboard/configuracion", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around py-1.5 px-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-[#3D7F35]"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-[#3D7F35]")} />
              <span className="text-[10px] font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
