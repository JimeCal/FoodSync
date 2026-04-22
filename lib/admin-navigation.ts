import {
  Building2,
  KeyRound,
  LayoutDashboard,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  name: string;
  shortName: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const adminNavigation: AdminNavItem[] = [
  {
    name: "Resumen",
    shortName: "Inicio",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Vista general del sistema",
  },
  {
    name: "Clientes",
    shortName: "Clientes",
    href: "/admin/clientes",
    icon: Building2,
    description: "Control de cuentas activas",
  },
  {
    name: "Locales",
    shortName: "Locales",
    href: "/admin/locales",
    icon: MapPin,
    description: "Monitoreo operativo por sede",
  },
  {
    name: "Accesos",
    shortName: "Accesos",
    href: "/admin/accesos",
    icon: KeyRound,
    description: "Credenciales y seguridad",
  },
];
