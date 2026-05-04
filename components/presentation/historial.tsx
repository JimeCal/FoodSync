"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, TrendingDown, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const historicalData = [
  { date: "Lun 14", producido: 520, vendido: 489, desperdicio: 31, porcentaje: 6.0 },
  { date: "Mar 15", producido: 540, vendido: 508, desperdicio: 32, porcentaje: 5.9 },
  { date: "Mié 16", producido: 515, vendido: 488, desperdicio: 27, porcentaje: 5.2 },
  { date: "Jue 17", producido: 560, vendido: 529, desperdicio: 31, porcentaje: 5.5 },
  { date: "Vie 18", producido: 600, vendido: 580, desperdicio: 20, porcentaje: 3.3 },
  { date: "Sab 19", producido: 560, vendido: 534, desperdicio: 26, porcentaje: 4.6 },
  { date: "Dom 20", producido: 500, vendido: 470, desperdicio: 30, porcentaje: 6.0 },
];

const stats = {
  totalProduced: 3795,
  totalSold: 3598,
  totalWasted: 197,
  avgWastePercentage: 5.22,
  bestDay: "Vie 18",
  worstDay: "Mar 15",
};

export default function HistorialSection() {
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Historial
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Análisis de últimos 7 días
        </h1>
        <p className="mt-2 text-muted-foreground">
          Visualiza tendencias en producción, ventas y desperdicio. Usa estos datos para tomar decisiones informadas.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-[#3D7F35]" />
              Total producido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.totalProduced}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total vendido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-[#F5841F]">{stats.totalSold}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Total desperdicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-destructive">{stats.totalWasted}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">% Desperdicio prom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-[#3D7F35]">
              {stats.avgWastePercentage.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">promedio de 7 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Card>
        <CardHeader>
          <CardTitle>Producción vs Ventas</CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="producido" fill="#3D7F35" name="Producido" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vendido" fill="#F5841F" name="Vendido" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolución del desperdicio</CardTitle>
          <CardDescription>Porcentaje diario - Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 8]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="porcentaje"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-green-200/50 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/10">
          <CardHeader>
            <CardTitle className="text-base">Mejor día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.bestDay}</span>
              <span className="text-sm text-muted-foreground">con 3.3% de desperdicio</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Viernes fue tu día más eficiente. Revisa qué cambios hiciste ese día para replicarlos.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
          <CardHeader>
            <CardTitle className="text-base">Día con más desperdicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.worstDay}</span>
              <span className="text-sm text-muted-foreground">con 5.9% de desperdicio</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Martes fue el día con mayor porcentaje. Investiga qué factores contribuyeron.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exportar */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Exportar datos</CardTitle>
          <CardDescription>Descarga tu historial para análisis externo o reportes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            📄 Descargar como CSV
          </Button>
          <Button variant="outline" className="gap-2">
            📊 Descargar como PDF
          </Button>
          <Button variant="outline" className="gap-2">
            📈 Compartir con equipo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
