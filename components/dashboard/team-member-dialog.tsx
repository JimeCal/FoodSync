"use client";

import { useEffect, useState } from "react";
import type { AdminCredential, AdminLocation } from "@/lib/admin-data";
import { staffRoleOptions, platformRoleLabels, type PlatformUserRole } from "@/lib/role-permissions";
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

const roleTitles: Record<Exclude<PlatformUserRole, "admin">, string> = {
  owner: "Propietario",
  manager: "Gerente",
  employee: "Empleado",
};

const roleScopes: Record<Exclude<PlatformUserRole, "admin">, string> = {
  owner: "Acceso completo al negocio y gestion del equipo",
  manager: "Operacion diaria, seguimiento y supervision",
  employee: "Registro diario y consulta operativa",
};

interface TeamMemberDialogProps {
  locations: AdminLocation[];
  onCreate: (input: {
    label: string;
    lastAccess: string;
    lastRotation: string;
    locationId?: string;
    passwordMask: string;
    role: string;
    scope: string;
    status: AdminCredential["status"];
    twoFactor: boolean;
    type: Exclude<PlatformUserRole, "admin">;
    username: string;
  }) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function TeamMemberDialog({
  locations,
  onCreate,
  onOpenChange,
  open,
}: TeamMemberDialogProps) {
  const [label, setLabel] = useState("");
  const [roleTitle, setRoleTitle] = useState(roleTitles.employee);
  const [platformRole, setPlatformRole] = useState<Exclude<PlatformUserRole, "admin">>("employee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [locationId, setLocationId] = useState<string>("global");
  const [status, setStatus] = useState<AdminCredential["status"]>("segura");
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLabel("");
    setRoleTitle(roleTitles.employee);
    setPlatformRole("employee");
    setUsername("");
    setPassword("");
    setLocationId(locations[0]?.id ?? "global");
    setStatus("segura");
    setTwoFactor(false);
  }, [locations, open]);

  const handleRoleChange = (value: string) => {
    const nextRole = value as Exclude<PlatformUserRole, "admin">;
    setPlatformRole(nextRole);
    setRoleTitle(roleTitles[nextRole]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    onCreate({
      label: label.trim(),
      lastAccess: "Sin acceso todavia",
      lastRotation: today,
      locationId: locationId === "global" ? undefined : locationId,
      passwordMask: password.trim(),
      role: roleTitle.trim(),
      scope: roleScopes[platformRole],
      status,
      twoFactor,
      type: platformRole,
      username: username.trim().toLowerCase(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nuevo acceso del equipo</DialogTitle>
          <DialogDescription>
            Crea un usuario interno para tu negocio y asignale un rol con sus permisos correspondientes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team-label">Nombre visible</Label>
              <Input
                id="team-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Ana Lopez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rol de plataforma</Label>
              <Select value={platformRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {staffRoleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {platformRoleLabels[option.value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-role">Cargo</Label>
              <Input
                id="team-role"
                value={roleTitle}
                onChange={(event) => setRoleTitle(event.target.value)}
                placeholder="Gerente de tienda"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Local asignado</Label>
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Todos los locales del negocio</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-username">Email o usuario</Label>
              <Input
                id="team-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="empleado@negocio.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-password">Contrasena</Label>
              <Input
                id="team-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Crea una contrasena"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Estado del acceso</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as AdminCredential["status"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="segura">Segura</SelectItem>
                  <SelectItem value="revision">Revision</SelectItem>
                  <SelectItem value="caducada">Caducada</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="rounded-2xl border border-[#3D7F35]/20 bg-[#3D7F35]/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Permisos del rol {platformRoleLabels[platformRole]}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{roleScopes[platformRole]}</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3D7F35] hover:bg-[#346B2D]">
              Crear usuario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
