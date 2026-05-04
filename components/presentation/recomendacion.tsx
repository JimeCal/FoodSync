"use client";

import { Sparkles, TrendingUp, Target, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    product: "Pan masa madre",
    current: 184,
    recommended: 172,
    reason: "Reducción basada en patrones de venta del último mes",
    savings: 12,
    impact: "12% reducción de merma estimada",
    confidence: 94,
  },
  {
    product: "Bolleria",
    current: 126,
    recommended: 118,
    reason: "Ajuste según demanda de fin de semana",
    savings: 8,
    impact: "6% reducción de merma estimada",
    confidence: 89,
  },
  {
    product: "Focaccias",
    current: 78,
    recommended: 74,
    reason: "Estabilidad en demanda permite reducción segura",
    savings: 4,
    impact: "5% reducción de merma estimada",
    confidence: 91,
  },
  {
    product: "Empanadas",
    current: 62,
    recommended: 58,
    reason: "Producto de demanda predecible",
    savings: 4,
    impact: "6% reducción de merma estimada",
    confidence: 87,
  },
];

export default function RecomendacionSection() {
  const totalSavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  const avgConfidence = Math.round(
    recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
  );

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Recomendaciones con IA
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Predicciones inteligentes para mañana
        </h1>
        <p className="mt-2 text-muted-foreground">
          Nuestro algoritmo analiza tu historial de ventas y desperdicio para recomendarte la producción óptima.
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#3D7F35]/20 bg-gradient-to-br from-[#3D7F35]/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-[#3D7F35]" />
              Reducción estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D7F35]">{totalSavings} uds</div>
            <p className="mt-1 text-xs text-muted-foreground">Por día si aplicas recomendaciones</p>
          </CardContent>
        </Card>

        <Card className="border-[#F5841F]/20 bg-gradient-to-br from-[#F5841F]/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#F5841F]" />
              Precisión del modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#F5841F]">{avgConfidence}%</div>
            <p className="mt-1 text-xs text-muted-foreground">Promedio de confianza</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-600" />
              Ahorro mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalSavings * 30} uds</div>
            <p className="mt-1 text-xs text-muted-foreground">Proyección mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones detalladas */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Recomendaciones por producto</h2>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <Card key={idx} className="border-border hover:border-[#3D7F35]/50 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{rec.product}</h3>
                    <Badge
                      variant="outline"
                      className="mt-1 border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]"
                    >
                      {rec.confidence}% confianza
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Ahorro estimado</div>
                    <div className="text-2xl font-bold text-[#3D7F35]">{rec.savings} uds</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p className="text-lg font-semibold text-foreground">{rec.current}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-0.5 w-8 bg-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recomendado</p>
                    <p className="text-lg font-semibold text-[#3D7F35]">{rec.recommended}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">¿Por qué? </span>
                    {rec.reason}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    📊 {rec.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <Card className="border-[#3D7F35]/20 bg-gradient-to-r from-[#3D7F35]/5 to-transparent">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">¿Listo para aplicar estas recomendaciones?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Regístralas en tu sistema de gestión y monitorea el impacto en tu merma.
            </p>
          </div>
          <Button className="gap-2 bg-[#3D7F35] hover:bg-[#346B2D] whitespace-nowrap">
            <Sparkles className="h-4 w-4" />
            Aplicar cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
