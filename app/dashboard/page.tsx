"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  mockUser, 
  calculateStats, 
  calculateRecommendation,
  formatDate 
} from "@/lib/mock-data";
import { 
  TrendingDown, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Trash2,
  ArrowRight,
  Sparkles,
  Leaf
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { CustomChartTooltip, WasteTooltip } from "@/components/chart-tooltip";

export default function DashboardPage() {
  const location = mockUser.locations[0];
  const records = location.records;
  const stats = calculateStats(records);
  const recommendation = calculateRecommendation(records);
  const todayRecord = records[records.length - 1];

  const chartData = records.slice(-7).map((record) => ({
    date: formatDate(record.date),
    producido: record.produced,
    vendido: record.sold,
    desperdicio: record.wasted,
  }));

  const wasteChartData = records.slice(-7).map((record) => ({
    date: formatDate(record.date),
    porcentaje: record.wastePercentage,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Hola, {mockUser.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {location.name} - Resumen de hoy
          </p>
        </div>
        <Link href="/dashboard/registro" className="w-full sm:w-auto">
          <Button className="gap-2 bg-[#3D7F35] hover:bg-[#346B2D] w-full sm:w-auto text-sm">
            Registrar datos de hoy
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Alert Card - Recomendacion destacada */}
      <Card className="border-[#3D7F35]/20 bg-gradient-to-r from-[#3D7F35]/5 to-[#3D7F35]/10">
        <CardContent className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F5841F]/20 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-[#F5841F]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              Recomendacion para manana
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Basado en tu historico de ventas, te recomendamos producir{" "}
              <span className="font-bold text-[#3D7F35] text-lg sm:text-xl">{recommendation} unidades</span>
              {" "}manana para optimizar tus recursos.
            </p>
          </div>
          <Link href="/dashboard/recomendacion" className="shrink-0 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 border-[#3D7F35] text-[#3D7F35] hover:bg-[#3D7F35]/10 w-full sm:w-auto text-sm">
              Ver detalles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Produccion hoy
            </CardTitle>
            <Package className="h-4 w-4 text-[#3D7F35]" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{todayRecord.produced}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Ventas hoy
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#F5841F]" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{todayRecord.sold}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">unidades vendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Desperdicio hoy
            </CardTitle>
            <Trash2 className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-destructive">{todayRecord.wasted}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">no vendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              % Desperdicio
            </CardTitle>
            {stats.trend < 0 ? (
              <TrendingDown className="h-4 w-4 text-[#3D7F35]" />
            ) : (
              <TrendingUp className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{todayRecord.wastePercentage}%</div>
            <p className={`text-[10px] sm:text-xs mt-1 ${stats.trend < 0 ? 'text-[#3D7F35]' : 'text-destructive'}`}>
              {stats.trend < 0 ? '' : '+'}{stats.trend}% vs semana ant.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Production vs Sales Chart */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Produccion vs Ventas</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Ultimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2} margin={{ left: -20, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip 
                    content={
                      <CustomChartTooltip 
                        labelMap={{ producido: "Producido", vendido: "Vendido" }}
                        suffix=" uds"
                      />
                    }
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                  />
                  <Bar 
                    dataKey="producido" 
                    fill="#3D7F35"
                    radius={[4, 4, 0, 0]}
                    name="Producido"
                  />
                  <Bar 
                    dataKey="vendido" 
                    fill="#F5841F"
                    radius={[4, 4, 0, 0]}
                    name="Vendido"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#3D7F35]" />
                <span className="text-xs sm:text-sm text-muted-foreground">Producido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F5841F]" />
                <span className="text-xs sm:text-sm text-muted-foreground">Vendido</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waste Percentage Chart */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Evolucion del desperdicio</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Porcentaje diario - Ultimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wasteChartData} margin={{ left: -20, right: 5 }}>
                  <defs>
                    <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                    domain={[0, 'auto']}
                  />
                  <ReferenceLine 
                    y={10} 
                    stroke="#3D7F35" 
                    strokeDasharray="5 5" 
                    strokeWidth={2}
                  />
                  <Tooltip content={<WasteTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '5 5' }} />
                  <Area 
                    type="monotone" 
                    dataKey="porcentaje" 
                    stroke="#ef4444" 
                    fill="url(#wasteGradient)"
                    strokeWidth={2}
                    name="% Desperdicio"
                    dot={{ fill: '#ef4444', strokeWidth: 0, r: 3 }}
                    activeDot={{ fill: '#ef4444', strokeWidth: 2, stroke: '#fff', r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ef4444]" />
                <span className="text-xs sm:text-sm text-muted-foreground">% Desperdicio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 sm:w-6 h-0.5 border-t-2 border-dashed border-[#3D7F35]" />
                <span className="text-xs sm:text-sm text-muted-foreground">Objetivo 10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Card */}
      <Card className="bg-gradient-to-r from-[#3D7F35]/5 to-transparent border-[#3D7F35]/20">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#3D7F35]/20 flex items-center justify-center shrink-0">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-[#3D7F35]" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              Tu impacto ambiental
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Con FoodSync has reducido aproximadamente{" "}
              <span className="font-bold text-[#3D7F35]">{Math.round(stats.totalWasted * 0.3)} kg</span>
              {" "}de desperdicio alimentario este mes, equivalente a{" "}
              <span className="font-bold text-[#3D7F35]">{Math.round(stats.totalWasted * 0.3 * 2.5)} kg</span>
              {" "}de CO2 evitado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
