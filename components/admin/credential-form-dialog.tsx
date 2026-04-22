"use client";

import { useEffect, useState } from "react";
import type { AdminClient, AdminCredential } from "@/lib/admin-data";
import { credentialTypeLabels, credentialTypeOptions } from "@/lib/role-permissions";
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
import { Switch } from "@/components/ui/switch";

const credentialStatusOptions = [
  { value: "segura", label: "Segura" },
  { value: "revision", label: "Revision" },
  { value: "caducada", label: "Caducada" },
] as const;

interface CredentialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: AdminClient[];
  initialCredential?: AdminCredential;
  onCreate: (input: {
    clientId: string;
    locationId?: string;
    label: string;
    role: string;
    type: AdminCredential["type"];
    username: string;
    passwordMask: string;
    scope: string;
    twoFactor: boolean;
    lastRotation: string;
    lastAccess: string;
    status: AdminCredential["status"];
  }) => void;
  onUpdate: (
    credentialId: string,
    updates: {
      clientId: string;
      locationId?: string;
      label: string;
      role: string;
      type: AdminCredential["type"];
      username: string;
      passwordMask: string;
      scope: string;
      twoFactor: boolean;
      lastRotation: string;
      lastAccess: string;
      status: AdminCredential["status"];
    },
  ) => void;
}

export function CredentialFormDialog({
  open,
  onOpenChange,
  clients,
  initialCredential,
  onCreate,
  onUpdate,
}: CredentialFormDialogProps) {
  const isEditMode = Boolean(initialCredential);
  const [clientId, setClientId] = useState(initialCredential?.clientId ?? clients[0]?.id ?? "");
  const [locationId, setLocationId] = useState(initialCredential?.locationId ?? "global");
  const [label, setLabel] = useState(initialCredential?.label ?? "");
  const [role, setRole] = useState(initialCredential?.role ?? "");
  const [type, setType] = useState<AdminCredential["type"]>(initialCredential?.type ?? "manager");
  const [username, setUsername] = useState(initialCredential?.username ?? "");
  const [passwordMask, setPasswordMask] = useState(initialCredential?.passwordMask ?? "");
  const [scope, setScope] = useState(initialCredential?.scope ?? "");
  const [twoFactor, setTwoFactor] = useState(initialCredential?.twoFactor ?? false);
  const [lastRotation, setLastRotation] = useState(initialCredential?.lastRotation ?? "2026-04-22");
  const [lastAccess, setLastAccess] = useState(initialCredential?.lastAccess ?? "Ahora mismo");
  const [status, setStatus] = useState<AdminCredential["status"]>(initialCredential?.status ?? "revision");

  useEffect(() => {
    if (!open) {
      return;
    }

    setClientId(initialCredential?.clientId ?? clients[0]?.id ?? "");
    setLocationId(initialCredential?.locationId ?? "global");
    setLabel(initialCredential?.label ?? "");
    setRole(initialCredential?.role ?? "");
    setType(initialCredential?.type ?? "manager");
    setUsername(initialCredential?.username ?? "");
    setPasswordMask(initialCredential?.passwordMask ?? "");
    setScope(initialCredential?.scope ?? "");
    setTwoFactor(initialCredential?.twoFactor ?? false);
    setLastRotation(initialCredential?.lastRotation ?? "2026-04-22");
    setLastAccess(initialCredential?.lastAccess ?? "Ahora mismo");
    setStatus(initialCredential?.status ?? "revision");
  }, [clients, initialCredential, open]);

  const selectedClient = clients.find((client) => client.id === clientId);
  const locationOptions = selectedClient?.locations ?? [];

  useEffect(() => {
    if (locationId === "global") {
      return;
    }

    if (!locationOptions.some((location) => location.id === locationId)) {
      setLocationId("global");
    }
  }, [locationId, locationOptions]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      clientId,
      locationId: locationId === "global" ? undefined : locationId,
      label: label.trim(),
      role: role.trim(),
      type,
      username: username.trim(),
      passwordMask: passwordMask.trim(),
      scope: scope.trim(),
      twoFactor,
      lastRotation: lastRotation.trim(),
      lastAccess: lastAccess.trim(),
      status,
    };

    if (isEditMode && initialCredential) {
      onUpdate(initialCredential.id, payload);
    } else {
      onCreate(payload);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar credencial" : "Crear credencial"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza el acceso, su alcance y el nivel de seguridad aplicado."
              : "Registra un nuevo acceso interno para cliente, local o integracion externa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alcance del local</Label>
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Cuenta global</SelectItem>
                  {locationOptions.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-label">Nombre interno</Label>
              <Input
                id="credential-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="API inventario, acceso manager..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-role">Puesto o cargo</Label>
              <Input
                id="credential-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Gerente de turno, propietaria..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rol de plataforma</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as AdminCredential["type"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {credentialTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {credentialTypeLabels[option.value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as AdminCredential["status"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {credentialStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-username">Usuario</Label>
              <Input
                id="credential-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="email o id tecnico"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-password">Password o mascara</Label>
              <Input
                id="credential-password"
                value={passwordMask}
                onChange={(event) => setPasswordMask(event.target.value)}
                placeholder="******** o tok_live_****A92"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-scope">Alcance</Label>
              <Input
                id="credential-scope"
                value={scope}
                onChange={(event) => setScope(event.target.value)}
                placeholder="Dashboard, POS, stock, soporte..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-rotation">Ultima rotacion</Label>
              <Input
                id="credential-rotation"
                value={lastRotation}
                onChange={(event) => setLastRotation(event.target.value)}
                placeholder="2026-04-22"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential-access">Ultimo acceso</Label>
              <Input
                id="credential-access"
                value={lastAccess}
                onChange={(event) => setLastAccess(event.target.value)}
                placeholder="Hoy 10:10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Doble factor</Label>
              <div className="flex h-10 items-center justify-between rounded-md border border-border px-3">
                <span className="text-sm text-foreground">
                  {twoFactor ? "Activado" : "Pendiente"}
                </span>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                  className="data-[state=checked]:bg-[#3D7F35]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3D7F35] hover:bg-[#346B2D]">
              {isEditMode ? "Guardar cambios" : "Crear credencial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
