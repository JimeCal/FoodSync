"use client";

import { useState, type ComponentType } from "react";
import Image from "next/image";
import {
  Building2,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { LevaduramadreDashboard } from "@/components/levaduramadre-dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RegistroDatosSection from "@/components/presentation/registro-datos";
import RecomendacionSection from "@/components/presentation/recomendacion";
import HistorialSection from "@/components/presentation/historial";
import MultiLocalSection from "@/components/presentation/multilocal";
import EquipoSection from "@/components/presentation/equipo";
import ConfiguracionSection from "@/components/presentation/configuracion";

type NavigationItem = {
  icon: ComponentType<{ className?: string }>;
  name: string;
  shortName: string;
  id: string;
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", shortName: "Inicio", icon: LayoutDashboard, id: "dashboard" },
  { name: "Registrar datos", shortName: "Registrar", icon: PlusCircle, id: "registro" },
  { name: "Recomendacion", shortName: "IA", icon: Sparkles, id: "recomendacion" },
  { name: "Historial", shortName: "Historial", icon: History, id: "historial" },
  { name: "Multi-local", shortName: "Locales", icon: Building2, id: "multilocal" },
  { name: "Equipo", shortName: "Equipo", icon: Users, id: "equipo" },
  { name: "Configuracion", shortName: "Ajustes", icon: Settings, id: "configuracion" },
];

export default function PublicDemoPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <LevaduramadreDashboard
            onRegister={() => setActiveSection("registro")}
            onViewDetails={() => setActiveSection("recomendacion")}
          />
        );
      case "registro":
        return <RegistroDatosSection />;
      case "recomendacion":
        return <RecomendacionSection />;
      case "historial":
        return <HistorialSection />;
      case "multilocal":
        return <MultiLocalSection />;
      case "equipo":
        return <EquipoSection />;
      case "configuracion":
        return <ConfiguracionSection />;
      default:
        return <LevaduramadreDashboard
          onRegister={() => setActiveSection("registro")}
          onViewDetails={() => setActiveSection("recomendacion")}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="min-h-screen pb-20 lg:pl-64 lg:pb-0">
        {renderContent()}
      </main>
      <PublicMobileNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </div>
  );
}

interface PublicSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

function PublicSidebar({ activeSection, setActiveSection }: PublicSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-sidebar lg:block">
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
          {navigation.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#3D7F35] text-white shadow-sm"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5841F]/20">
              <span className="text-sm font-semibold text-[#F5841F]">LM</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">Levaduramadre</p>
              <p className="truncate text-xs text-muted-foreground">Presentacion - Plan Plus</p>
            </div>
          </div>
          <div className="rounded-lg border border-[#3D7F35]/20 bg-gradient-to-r from-[#3D7F35]/10 to-[#3D7F35]/5 px-3 py-2 text-center text-xs font-medium text-[#3D7F35]">
            ✓ Acceso completo sin login
          </div>
        </div>
      </div>
    </aside>
  );
}

interface PublicMobileNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function PublicMobileNav({
  activeSection,
  setActiveSection,
  mobileMenuOpen,
  setMobileMenuOpen,
}: PublicMobileNavProps) {
  return (
    <>
      <nav className="safe-area-inset-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5">
          {navigation.slice(0, 4).map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex min-w-[72px] flex-1 shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors",
                  isActive
                    ? "bg-[#3D7F35]/10 text-[#3D7F35]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate text-[10px] font-medium">{item.shortName}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex min-w-[72px] flex-1 shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="truncate text-[10px] font-medium">Mas</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute bottom-16 right-2 z-50 w-56 rounded-lg border border-border bg-card p-2 shadow-lg">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-sm font-semibold">Mas opciones</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:bg-accent rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {navigation.slice(4).map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#3D7F35] text-white"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
