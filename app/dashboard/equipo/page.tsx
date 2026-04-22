"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { TeamMemberDialog } from "@/components/dashboard/team-member-dialog";
import { PermissionGate } from "@/components/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  adminClients as seedAdminClients,
  cloneAdminClients,
  syncClientAccessStats,
  type AdminClient,
  type AdminCredential,
} from "@/lib/admin-data";
import { loadAdminClientsSnapshot, saveStoredAdminClients } from "@/lib/admin-storage";
import {
  getRolePermissionLabels,
  platformRoleLabels,
  staffRoleOptions,
  type PlatformUserRole,
} from "@/lib/role-permissions";
import { usePlatformSession } from "@/lib/platform-session";

const roleStyles = {
  owner: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  manager: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  employee: "border-border bg-muted text-foreground",
};

const statusStyles = {
  segura: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  revision: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  caducada: "border-destructive/20 bg-destructive/10 text-destructive",
};

const roleOrder: Record<Exclude<PlatformUserRole, "admin">, number> = {
  owner: 1,
  manager: 2,
  employee: 3,
};

const roleScopes: Record<Exclude<PlatformUserRole, "admin">, string> = {
  owner: "Gestion completa del negocio, configuracion y equipo",
  manager: "Operacion diaria, supervision y seguimiento de locales",
  employee: "Registro diario y consulta de informacion operativa",
};

type StaffCredential = AdminCredential & { type: Exclude<PlatformUserRole, "admin"> };

const isStaffCredential = (credential: AdminCredential): credential is StaffCredential =>
  credential.type !== "api" && credential.type !== "admin";

export default function EquipoPage() {
  const { session } = usePlatformSession();
  const [clients, setClients] = useState<AdminClient[]>(() => cloneAdminClients(seedAdminClients));
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setClients(loadAdminClientsSnapshot());
  }, []);

  const currentClient = useMemo(
    () => clients.find((client) => client.id === session?.clientId),
    [clients, session?.clientId],
  );

  const teamMembers = useMemo(() => {
    if (!currentClient) {
      return [];
    }

    return currentClient.credentials
      .filter(isStaffCredential)
      .sort((a, b) => {
        const roleDiff = roleOrder[a.type] - roleOrder[b.type];

        if (roleDiff !== 0) {
          return roleDiff;
        }

        return a.label.localeCompare(b.label);
      });
  }, [currentClient]);

  const persistClients = (updater: (current: AdminClient[]) => AdminClient[]) => {
    setClients((current) => {
      const next = updater(current);
      saveStoredAdminClients(next);
      return next;
    });
  };

  const handleCreateMember = (input: {
    label: string;
    lastAccess: string;
    lastRotation: string;
    locationId?: string;
    passwordMask: string;
    role: string;
    scope: string;
    status: "segura" | "revision" | "caducada";
    twoFactor: boolean;
    type: Exclude<PlatformUserRole, "admin">;
    username: string;
  }) => {
    if (!currentClient) {
      return;
    }

    persistClients((current) =>
      current.map((client) => {
        if (client.id !== currentClient.id) {
          return client;
        }

        const targetLocation = input.locationId
          ? client.locations.find((location) => location.id === input.locationId)
          : undefined;

        return syncClientAccessStats({
          ...client,
          credentials: [
            ...client.credentials,
            {
              id: `${client.id}-cred-${Date.now()}`,
              clientId: client.id,
              clientName: client.businessName,
              label: input.label,
              lastAccess: input.lastAccess,
              lastRotation: input.lastRotation,
              locationId: input.locationId,
              locationName: targetLocation?.name,
              passwordMask: input.passwordMask,
              role: input.role,
              scope: input.scope,
              status: input.status,
              twoFactor: input.twoFactor,
              type: input.type,
              username: input.username,
            },
          ],
        });
      }),
    );
  };

  const updateMember = (
    credentialId: string,
    updater: (credential: StaffCredential) => StaffCredential,
  ) => {
    if (!currentClient) {
      return;
    }

    persistClients((current) =>
      current.map((client) => {
        if (client.id !== currentClient.id) {
          return client;
        }

        return syncClientAccessStats({
          ...client,
          credentials: client.credentials.map((credential) => {
            if (credential.id !== credentialId || !isStaffCredential(credential)) {
              return credential;
            }

            return updater(credential);
          }),
        });
      }),
    );
  };

  const deleteMember = (credentialId: string) => {
    if (!currentClient || credentialId === session?.credentialId) {
      return;
    }

    persistClients((current) =>
      current.map((client) =>
        client.id === currentClient.id
          ? syncClientAccessStats({
              ...client,
              credentials: client.credentials.filter((credential) => credential.id !== credentialId),
            })
          : client,
      ),
    );
  };

  const ownerCount = teamMembers.filter((credential) => credential.type === "owner").length;
  const managerCount = teamMembers.filter((credential) => credential.type === "manager").length;
  const employeeCount = teamMembers.filter((credential) => credential.type === "employee").length;

  if (!currentClient) {
    return (
      <PermissionGate
        permission="manageTeam"
        title="Solo el dueno puede gestionar el equipo"
        description="La administracion de usuarios y roles internos esta reservada al rol de dueno."
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Card>
            <CardContent className="p-6">
              <p className="font-medium text-foreground">No se encontro el negocio asociado a esta sesion.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Vuelve a iniciar sesion o revisa la configuracion del acceso con el que entraste.
              </p>
            </CardContent>
          </Card>
        </div>
      </PermissionGate>
    );
  }

  return (
    <PermissionGate
      permission="manageTeam"
      title="Solo el dueno puede gestionar el equipo"
      description="La administracion de usuarios y roles internos esta reservada al rol de dueno."
    >
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Equipo y permisos</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Gestiona accesos, roles y alcance de cada persona dentro de {currentClient?.businessName}.
            </p>
          </div>

          <Button
            className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] sm:w-auto"
            onClick={() => setIsCreateOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Usuarios humanos</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{teamMembers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Duenos</p>
              <p className="mt-2 text-2xl font-bold text-[#3D7F35]">{ownerCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Gerentes</p>
              <p className="mt-2 text-2xl font-bold text-[#F5841F]">{managerCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Empleados</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{employeeCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#3D7F35]/20 bg-[#3D7F35]/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <ShieldCheck className="h-5 w-5 text-[#3D7F35]" />
              Jerarquia de permisos
            </CardTitle>
            <CardDescription>
              Los permisos cambian automaticamente segun el rol que asignes a cada usuario.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {staffRoleOptions.map((role) => (
              <div key={role.value} className="rounded-2xl border border-border bg-background p-4">
                <Badge variant="outline" className={roleStyles[role.value]}>
                  {platformRoleLabels[role.value]}
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">{roleScopes[role.value]}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getRolePermissionLabels(role.value).map((permission) => (
                    <span
                      key={`${role.value}-${permission}`}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#3D7F35]" />
              Miembros del equipo
            </CardTitle>
            <CardDescription>
              Cambia roles, mueve accesos entre locales y elimina usuarios cuando ya no deban entrar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((credential) => {
              const isSelf = credential.id === session?.credentialId;

              return (
                <div key={credential.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">{credential.label}</h2>
                        <Badge variant="outline" className={roleStyles[credential.type]}>
                          {platformRoleLabels[credential.type]}
                        </Badge>
                        <Badge variant="outline" className={statusStyles[credential.status]}>
                          {credential.status}
                        </Badge>
                        {isSelf && <Badge variant="secondary">Tu acceso</Badge>}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          {credential.username} - {credential.role}
                        </p>
                        <p>
                          Local asignado:{" "}
                          <span className="font-medium text-foreground">
                            {credential.locationName || "Todos los locales"}
                          </span>
                        </p>
                        <p>
                          Seguridad:{" "}
                          <span className="font-medium text-foreground">
                            {credential.twoFactor ? "2FA activo" : "2FA pendiente"}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getRolePermissionLabels(credential.type).map((permission) => (
                          <span
                            key={`${credential.id}-${permission}`}
                            className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Rol</p>
                        <Select
                          disabled={isSelf}
                          value={credential.type}
                          onValueChange={(value) => {
                            const nextRole = value as Exclude<PlatformUserRole, "admin">;
                            updateMember(credential.id, (current) => ({
                              ...current,
                              role: platformRoleLabels[nextRole],
                              scope: roleScopes[nextRole],
                              type: nextRole,
                            }));
                          }}
                        >
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
                        <p className="text-xs text-muted-foreground">Local</p>
                        <Select
                          value={credential.locationId ?? "global"}
                          onValueChange={(value) => {
                            const nextLocationId = value === "global" ? undefined : value;
                            const nextLocationName = nextLocationId
                              ? currentClient?.locations.find((location) => location.id === nextLocationId)?.name
                              : undefined;

                            updateMember(credential.id, (current) => ({
                              ...current,
                              locationId: nextLocationId,
                              locationName: nextLocationName,
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Todos los locales</SelectItem>
                            {currentClient?.locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Estado</p>
                        <Select
                          value={credential.status}
                          onValueChange={(value) =>
                            updateMember(credential.id, (current) => ({
                              ...current,
                              status: value as typeof current.status,
                            }))
                          }
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
                        <p className="text-xs text-muted-foreground">Doble factor</p>
                        <div className="flex h-9 items-center justify-between rounded-md border border-border px-3">
                          <span className="text-sm text-foreground">
                            {credential.twoFactor ? "Activo" : "Pendiente"}
                          </span>
                          <Switch
                            checked={credential.twoFactor}
                            onCheckedChange={(checked) =>
                              updateMember(credential.id, (current) => ({
                                ...current,
                                twoFactor: checked,
                              }))
                            }
                            className="data-[state=checked]:bg-[#3D7F35]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <KeyRound className="h-4 w-4 text-[#F5841F]" />
                      Ultima rotacion: {credential.lastRotation}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                      disabled={isSelf}
                      onClick={() => {
                        const shouldDelete = window.confirm(
                          `Eliminar el acceso de "${credential.label}"?`,
                        );

                        if (shouldDelete) {
                          deleteMember(credential.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar acceso
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {currentClient && (
          <TeamMemberDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            locations={currentClient.locations}
            onCreate={handleCreateMember}
          />
        )}
      </div>
    </PermissionGate>
  );
}
