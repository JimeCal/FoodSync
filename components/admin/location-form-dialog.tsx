"use client";

import { useEffect, useState } from "react";
import type { AdminClient, AdminLocation } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const locationTypeOptions = [
  { value: "cafeteria", label: "Cafeteria" },
  { value: "panaderia", label: "Panaderia" },
  { value: "restaurante", label: "Restaurante" },
] as const;

const locationStatusOptions = [
  { value: "operativo", label: "Operativo" },
  { value: "atencion", label: "Atencion" },
  { value: "sincronizando", label: "Sincronizando" },
  { value: "incidencia", label: "Incidencia" },
] as const;

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: AdminClient[];
  initialLocation?: AdminLocation;
  onCreate: (input: {
    clientId: string;
    name: string;
    type: AdminLocation["type"];
    city: string;
    manager: string;
    status: AdminLocation["status"];
    lastSync: string;
    connectedDevices: number;
    openIncidents: number;
    posProvider: string;
  }) => void;
  onUpdate: (
    locationId: string,
    updates: {
      name: string;
      type: AdminLocation["type"];
      city: string;
      manager: string;
      status: AdminLocation["status"];
      lastSync: string;
      connectedDevices: number;
      openIncidents: number;
      posProvider: string;
    },
  ) => void;
}

export function LocationFormDialog({
  open,
  onOpenChange,
  clients,
  initialLocation,
  onCreate,
  onUpdate,
}: LocationFormDialogProps) {
  const isEditMode = Boolean(initialLocation);
  const [clientId, setClientId] = useState(initialLocation?.clientId ?? clients[0]?.id ?? "");
  const [name, setName] = useState(initialLocation?.name ?? "");
  const [type, setType] = useState<AdminLocation["type"]>(initialLocation?.type ?? "cafeteria");
  const [city, setCity] = useState(initialLocation?.city ?? "");
  const [manager, setManager] = useState(initialLocation?.manager ?? "");
  const [status, setStatus] = useState<AdminLocation["status"]>(initialLocation?.status ?? "operativo");
  const [lastSync, setLastSync] = useState(initialLocation?.lastSync ?? "Hace 1 min");
  const [connectedDevices, setConnectedDevices] = useState(initialLocation?.connectedDevices ?? 3);
  const [openIncidents, setOpenIncidents] = useState(initialLocation?.openIncidents ?? 0);
  const [posProvider, setPosProvider] = useState(initialLocation?.posProvider ?? "");

  useEffect(() => {
    if (!open) {
      return;
    }

    setClientId(initialLocation?.clientId ?? clients[0]?.id ?? "");
    setName(initialLocation?.name ?? "");
    setType(initialLocation?.type ?? "cafeteria");
    setCity(initialLocation?.city ?? "");
    setManager(initialLocation?.manager ?? "");
    setStatus(initialLocation?.status ?? "operativo");
    setLastSync(initialLocation?.lastSync ?? "Hace 1 min");
    setConnectedDevices(initialLocation?.connectedDevices ?? 3);
    setOpenIncidents(initialLocation?.openIncidents ?? 0);
    setPosProvider(initialLocation?.posProvider ?? "");
  }, [clients, initialLocation, open]);

  const selectedClient = clients.find((client) => client.id === clientId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      type,
      city: city.trim(),
      manager: manager.trim(),
      status,
      lastSync: lastSync.trim(),
      connectedDevices,
      openIncidents,
      posProvider: posProvider.trim(),
    };

    if (isEditMode && initialLocation) {
      onUpdate(initialLocation.id, payload);
    } else {
      onCreate({
        clientId,
        ...payload,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar local" : "Crear nuevo local"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza el estado operativo, responsables e infraestructura del local."
              : "Anade una nueva sede al cliente y dejala lista para seguimiento interno."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cliente</Label>
              {isEditMode ? (
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
                  {selectedClient?.businessName ?? initialLocation?.clientName}
                </div>
              ) : (
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-name">Nombre del local</Label>
              <Input
                id="location-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. FoodSync - Valencia Centro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(value) => setType(value as AdminLocation["type"])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-city">Ciudad</Label>
              <Input
                id="location-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Ej. Madrid"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-manager">Responsable</Label>
              <Input
                id="location-manager"
                value={manager}
                onChange={(event) => setManager(event.target.value)}
                placeholder="Nombre del manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as AdminLocation["status"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-provider">Proveedor POS</Label>
              <Input
                id="location-provider"
                value={posProvider}
                onChange={(event) => setPosProvider(event.target.value)}
                placeholder="Square, Glop, Last.app..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-sync">Ultima sincronizacion</Label>
              <Input
                id="location-sync"
                value={lastSync}
                onChange={(event) => setLastSync(event.target.value)}
                placeholder="Hace 4 min"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-devices">Dispositivos conectados</Label>
              <Input
                id="location-devices"
                type="number"
                min={0}
                value={connectedDevices}
                onChange={(event) => setConnectedDevices(Number(event.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-incidents">Incidencias abiertas</Label>
              <Input
                id="location-incidents"
                type="number"
                min={0}
                value={openIncidents}
                onChange={(event) => setOpenIncidents(Number(event.target.value))}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3D7F35] hover:bg-[#346B2D]">
              {isEditMode ? "Guardar cambios" : "Crear local"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
