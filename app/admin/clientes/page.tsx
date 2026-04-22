"use client";

import Link from "next/link";
import { ArrowRight, Building2, CreditCard, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientAggregateStats, getClientCredentialStats } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-context";

const clientStatusStyles = {
  saludable: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  atencion: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  critico: "border-destructive/20 bg-destructive/10 text-destructive",
};

const planStyles = {
  basic: "border-border bg-muted text-foreground",
  plus: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  premium: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
};

export default function AdminClientsPage() {
  const { clients, overview } = useAdmin();
  const totalUsers = clients.reduce((total, client) => total + client.activeUsers, 0);
  const averageWaste = Math.round(
    (clients.reduce((total, client) => total + getClientAggregateStats(client).avgWastePercentage, 0) /
      clients.length) *
      10,
  ) / 10;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Vista de control comercial y operativo para todas las cuentas activas.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/admin/locales">
            <Button className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] sm:w-auto">
              Ver locales
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/accesos">
            <Button variant="outline" className="w-full sm:w-auto">
              Control de accesos
            </Button>
          </Link>
        </div>
      </div>

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
                <p className="text-sm text-muted-foreground">MRR total</p>
                <p className="text-2xl font-bold text-foreground">{overview.monthlyRevenue}EUR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D7F35]/15">
                <Users className="h-5 w-5 text-[#3D7F35]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuarios activos</p>
                <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/15">
                <Building2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Desperdicio medio</p>
                <p className="text-2xl font-bold text-foreground">{averageWaste}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de cuentas</CardTitle>
          <CardDescription>
            Cada tarjeta resume operacion, plan, seguridad y capacidad de crecimiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {clients.map((client) => {
            const stats = getClientAggregateStats(client);
            const credentialStats = getClientCredentialStats(client);

            return (
              <div key={client.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">{client.businessName}</h2>
                      <Badge variant="outline" className={planStyles[client.plan]}>
                        Plan {client.plan}
                      </Badge>
                      <Badge variant="outline" className={clientStatusStyles[client.status]}>
                        {client.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        {client.ownerName} - {client.ownerEmail}
                      </p>
                      <p>
                        Account manager: <span className="font-medium text-foreground">{client.accountManager}</span>
                      </p>
                      <p>{client.notes}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[420px]">
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Locales</p>
                      <p className="text-xl font-bold text-foreground">{client.locations.length}</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Usuarios</p>
                      <p className="text-xl font-bold text-foreground">{client.activeUsers}</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Desperdicio</p>
                      <p className="text-xl font-bold text-foreground">{stats.avgWastePercentage}%</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">MRR</p>
                      <p className="text-xl font-bold text-foreground">{client.monthlyFee}EUR</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-3">
                  <div className="rounded-xl bg-[#3D7F35]/5 p-3">
                    <p className="text-xs text-muted-foreground">Relacion comercial</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Alta: {client.contractSince} - Renovacion: {client.renewalDate}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F5841F]/5 p-3">
                    <p className="text-xs text-muted-foreground">Seguridad</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {credentialStats.total} credenciales - {credentialStats.coverage}% con 2FA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {credentialStats.review} en revision - {credentialStats.expired} caducadas
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Actividad</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Ultimo acceso: {client.lastAccess}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Soporte {client.supportTier} - {client.seatsUsed} asientos usados
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
