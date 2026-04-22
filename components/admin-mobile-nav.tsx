"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {adminNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition-colors",
                isActive ? "text-[#3D7F35]" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-[#3D7F35]")} />
              <span className="truncate text-[10px] font-medium">{item.shortName}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
