"use client";

import { Settings, Bell, Lock, Palette, HelpCircle, LogOut, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ConfiguracionSection() {
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
          <Button variant="outline" className="gap-2">
            Editar información
          </Button>
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
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">Recomendación diaria</p>
                <p className="text-sm text-muted-foreground">Recibe predicciones cada mañana</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">Alerta de desperdicio</p>
                <p className="text-sm text-muted-foreground">Si superas el 5% de merma</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">Reporte semanal</p>
                <p className="text-sm text-muted-foreground">Resumen cada lunes por la mañana</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">Noticias y actualizaciones</p>
                <p className="text-sm text-muted-foreground">Entérate de nuevas funciones</p>
              </div>
              <Switch />
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
          <div className="grid sm:grid-cols-3 gap-3">
            <button className="p-4 rounded-lg border-2 border-[#3D7F35] bg-white dark:bg-slate-950 flex flex-col items-center gap-2 transition-all">
              <div className="w-8 h-8 rounded bg-white border border-muted" />
              <span className="text-sm font-semibold">Claro</span>
              <Check className="h-4 w-4 text-[#3D7F35]" />
            </button>
            <button className="p-4 rounded-lg border border-border hover:border-[#3D7F35] bg-slate-900 flex flex-col items-center gap-2 transition-all">
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-600" />
              <span className="text-sm font-semibold text-white">Oscuro</span>
            </button>
            <button className="p-4 rounded-lg border border-border hover:border-[#3D7F35] flex flex-col items-center gap-2 transition-all">
              <div className="flex gap-1">
                <div className="w-4 h-8 rounded-l bg-white border border-muted" />
                <div className="w-4 h-8 rounded-r bg-slate-800 border border-slate-600" />
              </div>
              <span className="text-sm font-semibold">Automático</span>
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
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            Activar 2FA
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
            <Button variant="outline" className="w-full justify-start gap-2">
              📖 Centro de ayuda
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              💬 Contactar soporte
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
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
          <Button variant="outline" className="w-full justify-start gap-2">
            📥 Descargar mis datos
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
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
            <Button variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
            <p className="text-sm font-medium text-foreground mb-2">Eliminar cuenta</p>
            <p className="text-xs text-muted-foreground mb-3">
              Esta acción no se puede deshacer. Eliminaremos todos tus datos de forma permanente.
            </p>
            <Button variant="destructive" className="gap-2">
              🗑️ Eliminar cuenta permanentemente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
