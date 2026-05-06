"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function RegistroDatosSection() {
  const [formData, setFormData] = useState({
    producido: "",
    vendido: "",
    desperdicio: "",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [calculatedPercentage, setCalculatedPercentage] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({ ...prev, [name]: numValue }));

    // Auto-calculate waste percentage
    if (name === "desperdicio" && formData.producido) {
      const produced = parseInt(formData.producido) || 0;
      const waste = numValue === "" ? 0 : numValue;
      if (produced > 0) {
        setCalculatedPercentage(Math.round((waste / produced) * 100 * 10) / 10);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const produced = parseInt(formData.producido) || 0;
  const sold = parseInt(formData.vendido) || 0;
  const waste = parseInt(formData.desperdicio) || 0;
  const percentage = produced > 0 ? Math.round((waste / produced) * 100 * 10) / 10 : 0;
  const recommendation = Math.round(produced * 1.04);

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Registrar datos
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Registra la producción de hoy
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ingresa los datos de producción, ventas y desperdicio para obtener recomendaciones de IA basadas en tu historial.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulario */}
        <Card className="border-[#3D7F35]/20">
          <CardHeader>
            <CardTitle>Datos de hoy</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
            <div className="mt-3 p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-800/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Modo presentación</span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                Los formularios están bloqueados para mantener la integridad de la demostración.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Producción */}
              <div className="space-y-2">
                <Label htmlFor="producido" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#3D7F35]" />
                  Unidades producidas
                </Label>
                <div className="relative">
                  <Input
                    id="producido"
                    name="producido"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.producido}
                    onChange={handleInputChange}
                    className="text-lg font-semibold pr-10"
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">Demo</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de unidades fabricadas hoy
                </p>
              </div>

              {/* Ventas */}
              <div className="space-y-2">
                <Label htmlFor="vendido" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-[#F5841F]" />
                  Unidades vendidas
                </Label>
                <div className="relative">
                  <Input
                    id="vendido"
                    name="vendido"
                    type="number"
                    placeholder="0"
                    min="0"
                    max={formData.producido || undefined}
                    value={formData.vendido}
                    onChange={handleInputChange}
                    className="text-lg font-semibold pr-10"
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">Demo</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unidades que se vendieron
                </p>
              </div>

              {/* Desperdicio */}
              <div className="space-y-2">
                <Label htmlFor="desperdicio" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  Unidades desaprovechadas
                </Label>
                <div className="relative">
                  <Input
                    id="desperdicio"
                    name="desperdicio"
                    type="number"
                    placeholder="0"
                    min="0"
                    max={formData.producido || undefined}
                    value={formData.desperdicio}
                    onChange={handleInputChange}
                    className="text-lg font-semibold pr-10"
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">Demo</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unidades no vendidas y desaprovechadas
                </p>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] opacity-75 cursor-not-allowed"
                size="lg"
                disabled
              >
                <Lock className="h-4 w-4" />
                Modo presentación - Solo lectura
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-[#3D7F35] text-[#3D7F35] hover:bg-[#F0FDF4] opacity-75 cursor-not-allowed"
                disabled
              >
                <ArrowRight className="h-4 w-4" />
                Cargar datos desde CSV
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resumen y análisis */}
        <div className="space-y-4">
          <Card className="border-[#3D7F35]/20 bg-gradient-to-br from-[#3D7F35]/5 to-[#3D7F35]/10">
            <CardHeader>
              <CardTitle className="text-lg">Resumen del día</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/50 p-3 dark:bg-slate-900/50">
                  <p className="text-xs text-muted-foreground">Producido</p>
                  <p className="text-2xl font-bold text-[#3D7F35]">{produced}</p>
                  <p className="text-xs text-muted-foreground mt-1">unidades</p>
                </div>
                <div className="rounded-lg bg-white/50 p-3 dark:bg-slate-900/50">
                  <p className="text-xs text-muted-foreground">Vendido</p>
                  <p className="text-2xl font-bold text-[#F5841F]">{sold}</p>
                  <p className="text-xs text-muted-foreground mt-1">unidades</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                  <p className="text-xs text-muted-foreground">Desperdicio</p>
                  <p className="text-2xl font-bold text-destructive">{waste}</p>
                  <p className="text-xs text-muted-foreground mt-1">unidades</p>
                </div>
                <div className={`rounded-lg p-3 border ${percentage > 5 ? "bg-destructive/10 border-destructive/20" : "bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50"}`}>
                  <p className="text-xs text-muted-foreground">% Desperdicio</p>
                  <p className={`text-2xl font-bold ${percentage > 5 ? "text-destructive" : "text-green-600 dark:text-green-400"}`}>
                    {percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">meta: 5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {produced > 0 && (
            <>
              <Card className="border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Recomendación para mañana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                      {recommendation}
                    </span>
                    <span className="text-muted-foreground">unidades recomendadas</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Basado en el promedio de ventas y ajustado al porcentaje de desperdicio actual.
                  </p>
                </CardContent>
              </Card>

              {percentage > 5 && (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Alerta de desperdicio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Tu porcentaje de desperdicio ({percentage.toFixed(1)}%) supera la meta del 5%. 
                    Considera ajustar la producción para próximos días.
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
