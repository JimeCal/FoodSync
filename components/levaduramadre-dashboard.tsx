"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Leaf,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  Trash2,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomChartTooltip, WasteTooltip } from "@/components/chart-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const records = [
  { date: "mar 14", producido: 2850, vendido: 2680, desperdicio: 170, porcentaje: 6.0 },
  { date: "mie 15", producido: 2950, vendido: 2780, desperdicio: 170, porcentaje: 5.8 },
  { date: "jue 16", producido: 2800, vendido: 2650, desperdicio: 150, porcentaje: 5.4 },
  { date: "vie 17", producido: 3100, vendido: 2920, desperdicio: 180, porcentaje: 5.8 },
  { date: "sab 18", producido: 3300, vendido: 3180, desperdicio: 120, porcentaje: 3.6 },
  { date: "dom 19", producido: 3050, vendido: 2900, desperdicio: 150, porcentaje: 4.9 },
  { date: "hoy", producido: 2750, vendido: 2580, desperdicio: 170, porcentaje: 6.2 },
];

const teams = [
  {
    name: "Diego",
    location: "Levaduramadre - Tienda centro",
    team: "8-12 personas",
    produced: 2750,
    wasted: 170,
    system: "Software especializado",
    budget: "500-800 €",
    interest: 95,
  },
  {
    name: "Ana",
    location: "Levaduramadre - Obrador",
    team: "15 personas",
    produced: 3300,
    wasted: 120,
    system: "Excel u hojas de calculo",
    budget: "+1000 €",
    interest: 65,
  },
];

const productPlan = [
  { producto: "Pan masa madre", actual: 950, recomendado: 820 },
  { producto: "Bolleria premium", actual: 680, recomendado: 580 },
  { producto: "Focaccias artesanales", actual: 420, recomendado: 380 },
  { producto: "Empanadas tradicionales", actual: 350, recomendado: 290 },
  { producto: "Otros productos", actual: 280, recomendado: 260 },
];

const today = records[records.length - 1];
const averageSold = Math.round(records.reduce((total, item) => total + item.vendido, 0) / records.length);
const recommendation = Math.round(averageSold * 1.04);
const totalWasted = records.reduce((total, item) => total + item.desperdicio, 0);

export function LevaduramadreDashboard({
  showBackLink = false,
  onRegister,
  onViewDetails,
}: {
  showBackLink?: boolean;
  onRegister?: () => void;
  onViewDetails?: () => void;
}) {
  const { toast } = useToast();

  const handleViewDetails = () => {
    onViewDetails?.();
    toast({
      title: "Ver detalle",
      description: "Abriendo la sección de recomendaciones para ver detalles.",
    });
  };

  const handleRegisterData = () => {
    onRegister?.();
    toast({
      title: "Registrar datos",
      description: "Abriendo el formulario de registro de datos. El envío está bloqueado en modo demo.",
    });
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
      <div>
        {showBackLink && (
          <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
        )}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]">
                Cliente piloto
              </Badge>
              <Badge variant="outline" className="border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]">
                Levaduramadre
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
              Dashboard Levaduramadre
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Panaderia - Resumen de hoy con datos de produccion, ventas y desperdicio.
            </p>
          </div>
          <Button
            className="gap-2 bg-[#3D7F35] text-sm hover:bg-[#346B2D]"
            onClick={handleRegisterData}
          >
            Registrar datos de hoy
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

        <Card className="border-[#3D7F35]/20 bg-gradient-to-r from-[#3D7F35]/5 to-[#3D7F35]/10">
          <CardContent className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5841F]/20">
              <Sparkles className="h-6 w-6 text-[#F5841F]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                Recomendacion para mañana
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Basado en el historico reciente de Levaduramadre, recomendamos producir{" "}
                <span className="text-lg font-bold text-[#3D7F35] sm:text-xl">{recommendation} unidades</span>{" "}
                para mantener stock sin elevar la merma.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 border-[#3D7F35] text-[#3D7F35] hover:bg-[#3D7F35]/10"
              onClick={handleViewDetails}
            >
              Ver detalle
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MetricCard icon={<Package className="h-4 w-4 text-[#3D7F35]" />} label="Produccion hoy" value={today.producido} helper="unidades" />
          <MetricCard icon={<ShoppingCart className="h-4 w-4 text-[#F5841F]" />} label="Ventas hoy" value={today.vendido} helper="unidades vendidas" />
          <MetricCard icon={<Trash2 className="h-4 w-4 text-destructive" />} label="Desperdicio hoy" value={today.desperdicio} helper="no vendidas" valueClassName="text-destructive" />
          <MetricCard icon={<TrendingDown className="h-4 w-4 text-[#3D7F35]" />} label="% Desperdicio" value={`${today.porcentaje}%`} helper="-1,1% vs semana ant." />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Produccion vs Ventas</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Ultimos 7 dias - Levaduramadre</CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={records} barGap={2} margin={{ left: -20, right: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={35} />
                    <Tooltip
                      content={<CustomChartTooltip labelMap={{ producido: "Producido", vendido: "Vendido" }} suffix=" uds" />}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                    />
                    <Bar dataKey="producido" fill="#3D7F35" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="vendido" fill="#F5841F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Legend first="Producido" second="Vendido" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Evolucion del desperdicio</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Porcentaje diario - Ultimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={records} margin={{ left: -20, right: 5 }}>
                    <defs>
                      <linearGradient id="levaduramadreWasteGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={35} domain={[0, 8]} />
                    <ReferenceLine y={5} stroke="#3D7F35" strokeDasharray="5 5" strokeWidth={2} />
                    <Tooltip content={<WasteTooltip />} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "5 5" }} />
                    <Area
                      type="monotone"
                      dataKey="porcentaje"
                      stroke="#ef4444"
                      fill="url(#levaduramadreWasteGradient)"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", strokeWidth: 0, r: 3 }}
                      activeDot={{ fill: "#ef4444", strokeWidth: 2, stroke: "#fff", r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 border-t border-border pt-3 sm:mt-4 sm:gap-6 sm:pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444] sm:h-3 sm:w-3" />
                  <span className="text-xs text-muted-foreground sm:text-sm">% Desperdicio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-4 border-t-2 border-dashed border-[#3D7F35] sm:w-6" />
                  <span className="text-xs text-muted-foreground sm:text-sm">Objetivo 5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-5 w-5 text-[#3D7F35]" />
                Datos del cliente
              </CardTitle>
              <CardDescription>Informacion recogida en entrevistas con Levaduramadre.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teams.map((team) => (
                <div key={team.name} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{team.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {team.name} - {team.team}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]">
                      {team.budget}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <SmallStat label="Produce" value={team.produced} />
                    <SmallStat label="Merma" value={team.wasted} destructive />
                    <SmallStat label="Interes" value={`${team.interest}/100`} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Sistema actual: {team.system}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-5 w-5 text-[#3D7F35]" />
                Plan por categoria
              </CardTitle>
              <CardDescription>Comparacion entre produccion actual y recomendacion FoodSync.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[310px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productPlan} layout="vertical" margin={{ left: 12, right: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="producto" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={92} />
                    <Tooltip
                      content={<CustomChartTooltip labelMap={{ actual: "Actual", recomendado: "Recomendado" }} suffix=" uds" />}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                    />
                    <Bar dataKey="actual" fill="#F5841F" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="recomendado" fill="#3D7F35" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 border-t border-border pt-3 sm:mt-4 sm:gap-6 sm:pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#F5841F] sm:h-3 sm:w-3" />
                  <span className="text-xs text-muted-foreground sm:text-sm">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#3D7F35] sm:h-3 sm:w-3" />
                  <span className="text-xs text-muted-foreground sm:text-sm">Recomendado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#3D7F35]/20 bg-gradient-to-r from-[#3D7F35]/5 to-transparent">
          <CardContent className="flex flex-col items-center gap-4 p-4 text-center sm:flex-row sm:gap-6 sm:p-6 sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3D7F35]/20 sm:h-16 sm:w-16">
              <Leaf className="h-6 w-6 text-[#3D7F35] sm:h-8 sm:w-8" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">Impacto ambiental estimado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Con FoodSync, Levaduramadre podria reducir aproximadamente{" "}
                <span className="font-bold text-[#3D7F35]">{Math.round(totalWasted * 0.3)} kg</span>{" "}
                de desperdicio esta semana, equivalente a{" "}
                <span className="font-bold text-[#3D7F35]">{Math.round(totalWasted * 0.3 * 2.5)} kg</span>{" "}
                de CO2 evitado.
              </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

function MetricCard({
  helper,
  icon,
  label,
  value,
  valueClassName = "text-foreground",
}: {
  helper: string;
  icon: ReactNode;
  label: string;
  value: number | string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 sm:p-6 sm:pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className={`text-xl font-bold sm:text-2xl ${valueClassName}`}>{value}</div>
        <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{helper}</p>
      </CardContent>
    </Card>
  );
}

function SmallStat({
  destructive = false,
  label,
  value,
}: {
  destructive?: boolean;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-semibold ${destructive ? "text-destructive" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Legend({ first, second }: { first: string; second: string }) {
  return (
    <div className="mt-3 flex items-center justify-center gap-4 border-t border-border pt-3 sm:mt-4 sm:gap-6 sm:pt-4">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-[#3D7F35] sm:h-3 sm:w-3" />
        <span className="text-xs text-muted-foreground sm:text-sm">{first}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-[#F5841F] sm:h-3 sm:w-3" />
        <span className="text-xs text-muted-foreground sm:text-sm">{second}</span>
      </div>
    </div>
  );
}
