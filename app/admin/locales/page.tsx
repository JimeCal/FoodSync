"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  MapPin,
  Package,
  PlusCircle,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { LocationFormDialog } from "@/components/admin/location-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getLocationRecommendation,
  getLocationTodayRecord,
  type AdminLocation,
} from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-context";
import { calculateStats } from "@/lib/mock-data";

const locationStatusStyles = {
  operativo: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  atencion: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  sincronizando: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  incidencia: "border-destructive/20 bg-destructive/10 text-destructive",
};

const locationPriority = {
  incidencia: 4,
  sincronizando: 3,
  atencion: 2,
  operativo: 1,
};

export default function AdminLocationsPage() {
  const { clients, locations, overview, createLocation, updateLocation, deleteLocation } = useAdmin();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | undefined>(undefined);
  const [previewLocation, setPreviewLocation] = useState<AdminLocation | undefined>(undefined);

  const orderedLocations = [...locations].sort((a, b) => {
    const priorityDiff = locationPriority[b.status] - locationPriority[a.status];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return b.openIncidents - a.openIncidents;
  });

  const recommendationSum = locations.reduce(
    (total, location) => total + getLocationRecommendation(location),
    0,
  );

  const previewStats = previewLocation ? calculateStats(previewLocation.records) : null;
  const previewTodayRecord = previewLocation ? getLocationTodayRecord(previewLocation) : null;
  const previewRecommendation = previewLocation ? getLocationRecommendation(previewLocation) : null;
  const previewRecentRecords = previewLocation ? [...previewLocation.records].slice(-5).reverse() : [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Locales</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Seguimiento operativo por sede con foco en sincronizacion, desperdicio y responsables.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] sm:w-auto"
            onClick={() => setIsCreateOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo local
          </Button>
          <Link href="/admin/clientes">
            <Button variant="outline" className="w-full sm:w-auto">
              Volver a clientes
            </Button>
          </Link>
          <Link href="/admin/accesos">
            <Button className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] sm:w-auto">
              Revisar accesos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Locales monitorizados</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{overview.totalLocations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Con incidencias</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{overview.locationsRequiringAttention}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Desperdicio global</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{overview.avgWastePercentage}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Produccion recomendada</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{recommendationSum} uds</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapa operativo</CardTitle>
          <CardDescription>
            Estado de cada local, sus responsables y el rendimiento reciente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderedLocations.map((location) => {
            const stats = calculateStats(location.records);
            const todayRecord = getLocationTodayRecord(location);
            const recommendation = getLocationRecommendation(location);

            return (
              <div key={location.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">{location.name}</h2>
                      <Badge variant="outline" className={locationStatusStyles[location.status]}>
                        {location.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => setPreviewLocation(location)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Previsualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => setEditingLocation(location)}
                      >
                        Editar local
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          const shouldDelete = window.confirm(
                            `Eliminar el local "${location.name}"? Tambien se borraran sus credenciales asociadas.`,
                          );

                          if (shouldDelete) {
                            deleteLocation(location.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        {location.clientName} - {location.city}
                      </p>
                      <p>
                        Responsable: <span className="font-medium text-foreground">{location.manager}</span>
                      </p>
                      <p>
                        POS: <span className="font-medium text-foreground">{location.posProvider}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[440px]">
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Producido hoy</p>
                      <p className="text-xl font-bold text-foreground">{todayRecord.produced}</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Vendido hoy</p>
                      <p className="text-xl font-bold text-foreground">{todayRecord.sold}</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Desperdicio</p>
                      <p className="text-xl font-bold text-foreground">{todayRecord.wastePercentage}%</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Recomendacion</p>
                      <p className="text-xl font-bold text-foreground">{recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-3">
                  <div className="rounded-xl bg-[#3D7F35]/5 p-3">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Sincronizacion
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{location.lastSync}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5841F]/5 p-3">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Infraestructura
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {location.connectedDevices} dispositivos conectados
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TriangleAlert className="h-3.5 w-3.5" />
                      Riesgo actual
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {location.openIncidents} incidencias - promedio {stats.avgWastePercentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <LocationFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        clients={clients}
        onCreate={createLocation}
        onUpdate={updateLocation}
      />

      <LocationFormDialog
        open={Boolean(editingLocation)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLocation(undefined);
          }
        }}
        clients={clients}
        initialLocation={editingLocation}
        onCreate={createLocation}
        onUpdate={updateLocation}
      />

      <Dialog open={Boolean(previewLocation)} onOpenChange={(open) => !open && setPreviewLocation(undefined)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Previsualizacion del local</DialogTitle>
            <DialogDescription>
              Vista rapida del panel que tendria {previewLocation?.name} para administracion interna.
            </DialogDescription>
          </DialogHeader>

          {previewLocation && previewStats && previewTodayRecord && previewRecommendation !== null && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Produccion hoy</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {previewTodayRecord.produced}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Ventas hoy</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {previewTodayRecord.sold}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Desperdicio medio</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {previewStats.avgWastePercentage}%
                  </p>
                </div>
                <div className="rounded-2xl border border-[#3D7F35]/20 bg-[#3D7F35]/5 p-4">
                  <p className="text-xs text-muted-foreground">Recomendacion</p>
                  <p className="mt-2 text-2xl font-bold text-[#3D7F35]">
                    {previewRecommendation} uds
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={locationStatusStyles[previewLocation.status]}>
                      {previewLocation.status}
                    </Badge>
                    <Badge variant="secondary">{previewLocation.city}</Badge>
                    <Badge variant="secondary">{previewLocation.type}</Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Responsable
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {previewLocation.manager}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Ultima sincronizacion
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {previewLocation.lastSync}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TriangleAlert className="h-3.5 w-3.5" />
                        Incidencias abiertas
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {previewLocation.openIncidents}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        POS e infraestructura
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {previewLocation.posProvider} - {previewLocation.connectedDevices} dispositivos
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#F5841F]/20 bg-[#F5841F]/5 p-4">
                    <p className="text-sm font-medium text-foreground">
                      Resumen de lo que veria el local
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tendria acceso al rendimiento diario, historico del punto de venta y la recomendacion
                      para la siguiente jornada segun su rol asignado.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm font-medium text-foreground">Ultimos 5 registros</p>
                  <div className="mt-4 space-y-3">
                    {previewRecentRecords.map((record) => (
                      <div key={record.id} className="rounded-xl bg-muted/50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {record.date}
                          </p>
                          <span className="text-xs font-medium text-foreground">
                            {record.wastePercentage}% desp.
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                          <div className="rounded-lg bg-background p-2">
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Package className="h-3.5 w-3.5 text-[#3D7F35]" />
                              Prod.
                            </p>
                            <p className="mt-1 font-semibold text-foreground">{record.produced}</p>
                          </div>
                          <div className="rounded-lg bg-background p-2">
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ShoppingCart className="h-3.5 w-3.5 text-[#F5841F]" />
                              Vend.
                            </p>
                            <p className="mt-1 font-semibold text-foreground">{record.sold}</p>
                          </div>
                          <div className="rounded-lg bg-background p-2">
                            <p className="text-xs text-muted-foreground">Desp.</p>
                            <p className="mt-1 font-semibold text-destructive">{record.wasted}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
