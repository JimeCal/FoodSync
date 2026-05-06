"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Target, Lightbulb, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const recommendations = [
  {
    product: "Pan masa madre",
    current: 950,
    recommended: 820,
    reason: "Reducción drástica basada en patrones de venta del último trimestre - demanda estacional baja",
    savings: 130,
    impact: "14% reducción de merma estimada - ahorro de €2,600 mensuales",
    confidence: 92,
  },
  {
    product: "Bolleria premium",
    current: 680,
    recommended: 580,
    reason: "Sobreproducción detectada en fines de semana - ajuste agresivo necesario",
    savings: 100,
    impact: "15% reducción de merma estimada - ahorro de €1,800 mensuales",
    confidence: 88,
  },
  {
    product: "Focaccias artesanales",
    current: 420,
    recommended: 380,
    reason: "Producto de nicho con demanda inestable - optimización conservadora",
    savings: 40,
    impact: "10% reducción de merma estimada - ahorro de €720 mensuales",
    confidence: 95,
  },
  {
    product: "Empanadas tradicionales",
    current: 350,
    recommended: 290,
    reason: "Tendencia decreciente en ventas - reducción significativa recomendada",
    savings: 60,
    impact: "17% reducción de merma estimada - ahorro de €1,080 mensuales",
    confidence: 85,
  },
];

export default function RecomendacionSection() {
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const totalSavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  const avgConfidence = Math.round(
    recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
  );

  const handleApplyChanges = async () => {
    if (isApplying) return;

    setIsApplying(true);
    try {
      // Simular aplicación de cambios
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Recomendaciones aplicadas",
        description: `Se han aplicado ${recommendations.length} recomendaciones. Ahorro estimado: ${totalSavings} unidades.`,
      });
    } catch (error) {
      toast({
        title: "Error al aplicar cambios",
        description: "Ha ocurrido un error al aplicar las recomendaciones. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

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
                    {rec.impact}
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
          <Button className="gap-2 bg-[#3D7F35] hover:bg-[#346B2D] whitespace-nowrap opacity-75 cursor-not-allowed" disabled>
            <Lock className="h-4 w-4" />
            Modo demo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
