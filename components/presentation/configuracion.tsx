"use client";

import { useEffect, useState } from "react";
import { Settings, Bell, Lock, Palette, HelpCircle, LogOut, Check, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ConfiguracionSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const { toast } = useToast();

  const applyTheme = (newTheme: "light" | "dark" | "auto") => {
    const root = document.documentElement;
    root.dataset.theme = newTheme;

    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    }
  };

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("foodsync-theme") as "light" | "dark" | "auto" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      applyTheme(theme);
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    window.localStorage.setItem("foodsync-theme", newTheme);
    applyTheme(newTheme);

    toast({
      title: "Tema actualizado",
      description: `Tema cambiado a ${newTheme === "light" ? "claro" : newTheme === "dark" ? "oscuro" : "automático"}`,
    });
  };
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Configuración
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Ajustes de cuenta
        </h1>
        <p className="mt-2 text-muted-foreground">
          Personaliza tu experiencia y gestiona las preferencias de tu cuenta y negocio.
        </p>
      </div>

      {/* Información de cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#3D7F35]" />
            Información de la cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Nombre del negocio</Label>
              <p className="text-foreground font-semibold">Levaduramadre</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Tipo de negocio</Label>
              <p className="text-foreground font-semibold">Panadería artesanal</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Email principal</Label>
              <p className="text-foreground font-semibold">diego@levaduramadre.es</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Plan actual</Label>
              <Badge className="bg-[#3D7F35] text-white mt-1">Plan Plus</Badge>
            </div>
          </div>
          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-800/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Modo presentación</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
              Los ajustes están bloqueados para mantener la integridad de la demostración.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#3D7F35]" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Elige cómo deseas recibir actualizaciones sobre tu negocio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border opacity-75">
              <div>
                <p className="font-semibold text-foreground">Recomendación diaria</p>
                <p className="text-sm text-muted-foreground">Recibe predicciones cada mañana</p>
              </div>
              <Switch defaultChecked disabled />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border opacity-75">
              <div>
                <p className="font-semibold text-foreground">Alerta de desperdicio</p>
                <p className="text-sm text-muted-foreground">Si superas el 5% de merma</p>
              </div>
              <Switch defaultChecked disabled />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border opacity-75">
              <div>
                <p className="font-semibold text-foreground">Reporte semanal</p>
                <p className="text-sm text-muted-foreground">Resumen cada lunes por la mañana</p>
              </div>
              <Switch defaultChecked disabled />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border opacity-75">
              <div>
                <p className="font-semibold text-foreground">Noticias y actualizaciones</p>
                <p className="text-sm text-muted-foreground">Entérate de nuevas funciones</p>
              </div>
              <Switch disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tema e interfaz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#3D7F35]" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza cómo se ve FoodSync en tu dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={cn(
                "group relative flex flex-col items-start space-y-3 rounded-3xl border px-5 py-6 text-left transition-all duration-200",
                theme === "light"
                  ? "border-[#3D7F35] bg-[#F0FDF4] shadow-sm shadow-[#3D7F35]/10"
                  : "border-border bg-card hover:border-[#3D7F35] hover:bg-white/90 dark:bg-slate-950 dark:hover:bg-slate-900",
              )}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#3D7F35] shadow-sm shadow-slate-200 dark:bg-slate-900 dark:text-[#A7F3D0]">
                <span className="text-xl font-bold">☀</span>
              </div>
              <span className="text-sm font-semibold text-foreground">Claro</span>
              <p className="text-xs text-muted-foreground">Iluminación suave, máximo contraste.</p>
              {theme === "light" && <Check className="absolute right-4 top-4 h-4 w-4 text-[#3D7F35]" />}
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={cn(
                "group relative flex flex-col items-start space-y-3 rounded-3xl border px-5 py-6 text-left transition-all duration-200",
                theme === "dark"
                  ? "border-[#3D7F35] bg-[#071A0F] shadow-sm shadow-[#3D7F35]/20"
                  : "border-border bg-slate-950 hover:border-[#3D7F35] hover:bg-slate-900",
              )}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-[#A7F3D0] shadow-sm shadow-slate-950">
                <span className="text-xl font-bold">🌙</span>
              </div>
              <span className="text-sm font-semibold text-white">Oscuro</span>
              <p className="text-xs text-slate-400">Ambiente elegante con luminosidad tenue.</p>
              {theme === "dark" && <Check className="absolute right-4 top-4 h-4 w-4 text-[#3D7F35]" />}
            </button>

            <button
              onClick={() => handleThemeChange("auto")}
              className={cn(
                "group relative flex flex-col items-start space-y-3 rounded-3xl border px-5 py-6 text-left transition-all duration-200",
                theme === "auto"
                  ? "border-[#3D7F35] bg-[#EFF6FF] shadow-sm shadow-[#3D7F35]/10 dark:bg-[#0F172A]"
                  : "border-border bg-card hover:border-[#3D7F35] hover:bg-white/90 dark:bg-slate-950 dark:hover:bg-slate-900",
              )}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#0B1120] text-white shadow-sm shadow-slate-900">
                <span className="text-xl font-bold">⟳</span>
              </div>
              <span className="text-sm font-semibold text-foreground">Automático</span>
              <p className="text-xs text-muted-foreground">Se ajusta a las preferencias del sistema.</p>
              {theme === "auto" && <Check className="absolute right-4 top-4 h-4 w-4 text-[#3D7F35]" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#3D7F35]" />
            Seguridad
          </CardTitle>
          <CardDescription>
            Protege tu cuenta con configuraciones de seguridad avanzadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg border border-border flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Autenticación de dos factores</p>
              <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
            </div>
            <Badge variant="outline" className="border-amber-200/50 bg-amber-50/50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/10 dark:text-amber-400">
              No activado
            </Badge>
          </div>
          <Button variant="outline" className="gap-2 w-full sm:w-auto opacity-75 cursor-not-allowed" disabled>
            <Lock className="h-4 w-4" />
            Modo demo
          </Button>

          <div className="pt-4 border-t border-border">
            <p className="font-semibold text-foreground mb-3">Sesiones activas</p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Navegador - Windows</p>
                  <p className="text-xs text-muted-foreground">Última actividad: hace 2 minutos</p>
                </div>
                <Badge className="bg-green-50/50 border-green-200/50 text-green-700 dark:bg-green-950/20 dark:border-green-800/50 dark:text-green-400">
                  ● Activa
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#3D7F35]" />
            Soporte y ayuda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 opacity-75 cursor-not-allowed" disabled>
              📄 Centro de ayuda
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 opacity-75 cursor-not-allowed" disabled>
              💬 Contactar soporte
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 opacity-75 cursor-not-allowed" disabled>
              📧 Reportar un problema
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Datos y privacidad */}
      <Card>
        <CardHeader>
          <CardTitle>Datos y privacidad</CardTitle>
          <CardDescription>
            Gestiona cómo se usan tus datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2 opacity-75 cursor-not-allowed" disabled>
            📥 Descargar mis datos
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 opacity-75 cursor-not-allowed" disabled>
            🗑️ Solicitar eliminación de datos
          </Button>
        </CardContent>
      </Card>

      {/* Zona de peligro */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de peligro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
            <p className="text-sm font-medium text-foreground mb-2">Cerrar sesión</p>
            <Button variant="outline" className="gap-2 opacity-75 cursor-not-allowed" disabled>
              <Lock className="h-4 w-4" />
              Modo demo
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
            <p className="text-sm font-medium text-foreground mb-2">Eliminar cuenta</p>
            <p className="text-xs text-muted-foreground mb-3">
              Esta acción no se puede deshacer. Eliminaremos todos tus datos de forma permanente.
            </p>
            <Button variant="destructive" className="gap-2 opacity-75 cursor-not-allowed" disabled>
              <Lock className="h-4 w-4" />
              Modo demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
