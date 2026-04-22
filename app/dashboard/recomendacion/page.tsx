"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  mockUser, 
  calculateRecommendation,
  calculateStats,
  formatDate
} from "@/lib/mock-data";
import { 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { CustomChartTooltip } from "@/components/chart-tooltip";

export default function RecomendacionPage() {
  const location = mockUser.locations[0];
  const records = location.records;
  const recommendation = calculateRecommendation(records);
  const stats = calculateStats(records);
  
  const last7Days = records.slice(-7);
  const avgProduced = Math.round(last7Days.reduce((acc, r) => acc + r.produced, 0) / last7Days.length);
  const avgSold = Math.round(last7Days.reduce((acc, r) => acc + r.sold, 0) / last7Days.length);
  const avgWasted = Math.round(last7Days.reduce((acc, r) => acc + r.wasted, 0) / last7Days.length);
  
  const chartData = records.slice(-7).map((record) => ({
    date: formatDate(record.date),
    vendido: record.sold,
    producido: record.produced,
  }));

  const potentialSavings = avgWasted * 2.5;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Recomendacion inteligente
        </h1>
        <p className="text-muted-foreground mt-1 capitalize">
          Para {tomorrowFormatted}
        </p>
      </div>

      {/* Main Recommendation Card */}
      <Card className="border-[#3D7F35]/30 bg-gradient-to-br from-[#3D7F35]/5 via-[#3D7F35]/10 to-[#F5841F]/5 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-[#F5841F]/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-16 w-16 text-[#F5841F]" />
            </div>
            <div className="text-center lg:text-left flex-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Te recomendamos producir
              </p>
              <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-4">
                <span className="text-6xl lg:text-7xl font-bold text-[#3D7F35]">
                  {recommendation}
                </span>
                <span className="text-2xl text-muted-foreground">unidades</span>
              </div>
              <p className="text-muted-foreground max-w-lg">
                Esta recomendacion esta basada en tu historico de ventas de los ultimos 7 dias, 
                con un pequeno buffer de seguridad para evitar quedarte sin stock.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#3D7F35]/20 flex items-center justify-center shrink-0">
                <BarChart3 className="h-5 w-5 text-[#3D7F35]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio de ventas (7 dias)</p>
                <p className="text-2xl font-bold text-foreground">{avgSold} uds</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Producias en promedio {avgProduced} uds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stats.trend < 0 ? 'bg-[#3D7F35]/20' : 'bg-destructive/20'}`}>
                {stats.trend < 0 ? (
                  <TrendingDown className="h-5 w-5 text-[#3D7F35]" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tendencia de desperdicio</p>
                <p className={`text-2xl font-bold ${stats.trend < 0 ? 'text-[#3D7F35]' : 'text-destructive'}`}>
                  {stats.trend < 0 ? 'Bajando' : 'Subiendo'} {Math.abs(stats.trend)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  vs semana anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#F5841F]/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-[#F5841F]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ahorro potencial semanal</p>
                <p className="text-2xl font-bold text-foreground">{potentialSavings.toFixed(0)}EUR</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Si reduces el desperdicio al 5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historico de ventas</CardTitle>
          <CardDescription>
            La linea punteada indica la recomendacion de produccion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D7F35" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3D7F35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip 
                  content={
                    <CustomChartTooltip 
                      labelMap={{ vendido: "Vendido" }}
                      suffix=" uds"
                    />
                  }
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '5 5' }}
                />
                <ReferenceLine 
                  y={recommendation} 
                  stroke="#F5841F" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ 
                    value: `Recomendacion: ${recommendation}`, 
                    position: 'right',
                    fill: '#F5841F',
                    fontSize: 11
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="vendido" 
                  stroke="#3D7F35" 
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                  name="Vendido"
                  dot={{ fill: '#3D7F35', strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: '#3D7F35', strokeWidth: 2, stroke: '#fff', r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3D7F35]" />
              <span className="text-sm text-muted-foreground">Ventas diarias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5" style={{ borderTop: '2px dashed #F5841F' }} />
              <span className="text-sm text-muted-foreground">Recomendacion</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[#3D7F35]" />
            Como calculamos esta recomendacion?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3D7F35] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Analizamos tus ventas</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Revisamos el historico de ventas de los ultimos 7 dias para identificar patrones.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3D7F35] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Calculamos la demanda</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Determinamos el promedio de unidades vendidas y la tendencia del mercado.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F5841F] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Anadimos un buffer</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Incluimos un 5% extra para evitar quedarte sin stock en momentos de alta demanda.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard/registro">
          <Button size="lg" className="gap-2 bg-[#3D7F35] hover:bg-[#346B2D]">
            <CheckCircle2 className="h-5 w-5" />
            Registrar datos de hoy
          </Button>
        </Link>
        <Link href="/dashboard/historial">
          <Button variant="outline" size="lg" className="gap-2 border-[#3D7F35] text-[#3D7F35] hover:bg-[#3D7F35]/10">
            Ver historial completo
          </Button>
        </Link>
      </div>
    </div>
  );
}
