"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  CreditCard,
  Shield,
  TriangleAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomChartTooltip } from "@/components/chart-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getClientAggregateStats } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-context";

const clientStatusStyles = {
  saludable: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  atencion: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  critico: "border-destructive/20 bg-destructive/10 text-destructive",
};

const alertStyles = {
  info: "border-border bg-muted/50 text-foreground",
  warning: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  critical: "border-destructive/20 bg-destructive/10 text-destructive",
};

const priorityScore = {
  critico: 3,
  atencion: 2,
  saludable: 1,
};

export default function AdminOverviewPage() {
  const { alerts, clients, overview, planDistribution, wasteByClient } = useAdmin();

  const prioritizedClients = [...clients].sort((a, b) => {
    const statusDiff = priorityScore[b.status] - priorityScore[a.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return getClientAggregateStats(b).avgWastePercentage - getClientAggregateStats(a).avgWastePercentage;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3D7F35]/20 bg-[#3D7F35]/10 px-3 py-1 text-xs font-medium text-[#3D7F35]">
            <Shield className="h-3.5 w-3.5" />
            Vista interna solo administrador
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Centro de control FoodSync
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Supervisa clientes, credenciales, locales y salud operativa desde una sola vista.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/admin/clientes">
            <Button className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] sm:w-auto">
              Ver clientes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/accesos">
            <Button variant="outline" className="w-full sm:w-auto">
              Revisar accesos
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-[#F5841F]/20 bg-gradient-to-r from-[#F5841F]/10 to-transparent">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5841F]/20">
              <TriangleAlert className="h-5 w-5 text-[#F5841F]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {overview.clientsNeedingAttention} cuentas necesitan seguimiento
              </p>
              <p className="text-sm text-muted-foreground">
                Hay {overview.totalOpenIncidents} incidencias abiertas y alertas activas en credenciales y locales.
              </p>
            </div>
          </div>
          <Link href="/admin/locales">
            <Button variant="outline" className="border-[#F5841F]/30 text-[#F5841F] hover:bg-[#F5841F]/10">
              Abrir incidencias
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D7F35]/15">
                <Building2 className="h-5 w-5 text-[#3D7F35]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes activos</p>
                <p className="text-2xl font-bold text-foreground">{overview.totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5841F]/15">
                <CreditCard className="h-5 w-5 text-[#F5841F]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR administrado</p>
                <p className="text-2xl font-bold text-foreground">{overview.monthlyRevenue}EUR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D7F35]/15">
                <Activity className="h-5 w-5 text-[#3D7F35]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Locales monitorizados</p>
                <p className="text-2xl font-bold text-foreground">{overview.totalLocations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/15">
                <TriangleAlert className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alertas abiertas</p>
                <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Desperdicio promedio por cliente</CardTitle>
            <CardDescription>
              Identifica rapido las cuentas que requieren acompanamiento operativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteByClient} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis
                    dataKey="client"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip
                    content={
                      <CustomChartTooltip
                        labelMap={{ desperdicio: "Desperdicio promedio" }}
                        suffix="%"
                      />
                    }
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar
                    dataKey="desperdicio"
                    fill="#3D7F35"
                    radius={[6, 6, 0, 0]}
                    name="Desperdicio"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salud de la plataforma</CardTitle>
            <CardDescription>
              Cobertura de seguridad y operacion agregada del entorno.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cobertura 2FA</span>
                <span className="font-semibold text-foreground">{overview.twoFactorCoverage}%</span>
              </div>
              <Progress
                value={overview.twoFactorCoverage}
                className="[&_[data-slot=progress-indicator]]:bg-[#3D7F35]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Credenciales seguras</span>
                <span className="font-semibold text-foreground">{overview.secureCredentialCoverage}%</span>
              </div>
              <Progress
                value={overview.secureCredentialCoverage}
                className="[&_[data-slot=progress-indicator]]:bg-[#F5841F]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Locales operativos</span>
                <span className="font-semibold text-foreground">{overview.operationalCoverage}%</span>
              </div>
              <Progress
                value={overview.operationalCoverage}
                className="[&_[data-slot=progress-indicator]]:bg-[#3D7F35]"
              />
            </div>

            <div className="rounded-2xl bg-muted/60 p-4">
              <p className="text-sm font-medium text-foreground">Distribucion de planes</p>
              <div className="mt-3 space-y-3">
                {planDistribution.map((plan) => (
                  <div key={plan.plan} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{plan.plan}</span>
                    <span className="font-semibold text-foreground">
                      {plan.clients} clientes / {plan.monthlyRevenue}EUR
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clientes prioritarios</CardTitle>
            <CardDescription>
              Cuentas ordenadas por riesgo y desperdicio promedio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prioritizedClients.slice(0, 4).map((client) => {
              const stats = getClientAggregateStats(client);

              return (
                <div key={client.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{client.businessName}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.ownerName} - {client.locations.length} locales
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={clientStatusStyles[client.status]}
                    >
                      {client.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Plan</p>
                      <p className="font-semibold capitalize text-foreground">{client.plan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Desperdicio</p>
                      <p className="font-semibold text-foreground">{stats.avgWastePercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MRR</p>
                      <p className="font-semibold text-foreground">{client.monthlyFee}EUR</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ultimo acceso</p>
                      <p className="font-semibold text-foreground">{client.lastAccess}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Centro de alertas</CardTitle>
            <CardDescription>
              Eventos recientes para revisar antes de que impacten al cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl border p-4 ${alertStyles[alert.severity]}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-sm opacity-80">{alert.description}</p>
                  </div>
                  <Badge variant="outline" className="w-fit capitalize">
                    {alert.category}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-col gap-1 text-xs opacity-80 sm:flex-row sm:items-center sm:justify-between">
                  <span>{alert.target}</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
