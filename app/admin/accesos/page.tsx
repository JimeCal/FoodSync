"use client";

import { useState } from "react";
import { KeyRound, LockKeyhole, PlusCircle, Shield, Trash2, TriangleAlert } from "lucide-react";
import { CredentialFormDialog } from "@/components/admin/credential-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getClientCredentialStats, type AdminCredential } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-context";
import { credentialTypeLabels } from "@/lib/role-permissions";

const credentialStatusStyles = {
  segura: "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]",
  revision: "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]",
  caducada: "border-destructive/20 bg-destructive/10 text-destructive",
};

export default function AdminAccessPage() {
  const {
    clients,
    credentials,
    overview,
    createCredential,
    updateCredential,
    deleteCredential,
  } = useAdmin();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<AdminCredential | undefined>(undefined);
  const credentialsInReview = credentials.filter((credential) => credential.status === "revision").length;
  const expiredCredentials = credentials.filter((credential) => credential.status === "caducada").length;
  const apiCredentials = credentials.filter((credential) => credential.type === "api").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Accesos y credenciales</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Control interno para revisar usuarios, rotaciones, cobertura 2FA y riesgos de seguridad.
          </p>
        </div>

        <Button
          className="w-full gap-2 bg-[#3D7F35] hover:bg-[#346B2D] sm:w-auto"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Nueva credencial
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D7F35]/15">
                <KeyRound className="h-5 w-5 text-[#3D7F35]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credenciales totales</p>
                <p className="text-2xl font-bold text-foreground">{credentials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5841F]/15">
                <Shield className="h-5 w-5 text-[#F5841F]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cobertura 2FA</p>
                <p className="text-2xl font-bold text-foreground">{overview.twoFactorCoverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5841F]/15">
                <LockKeyhole className="h-5 w-5 text-[#F5841F]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En revision</p>
                <p className="text-2xl font-bold text-foreground">{credentialsInReview}</p>
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
                <p className="text-sm text-muted-foreground">Caducadas</p>
                <p className="text-2xl font-bold text-foreground">{expiredCredentials}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Credenciales vigiladas</CardTitle>
            <CardDescription>
              Inventario interno de accesos visibles solo para administracion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-3 py-3 font-medium text-muted-foreground">Cliente</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Credencial</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Usuario</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Alcance</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">2FA</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Rotacion</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Ultimo acceso</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Estado</th>
                    <th className="px-3 py-3 font-medium text-muted-foreground">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map((credential) => (
                    <tr key={credential.id} className="border-b border-border/70">
                      <td className="px-3 py-3 align-top">
                        <div className="font-medium text-foreground">{credential.clientName}</div>
                        {credential.locationName && (
                          <div className="text-xs text-muted-foreground">{credential.locationName}</div>
                        )}
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="font-medium text-foreground">{credential.label}</div>
                        <div className="text-xs capitalize text-muted-foreground">
                          {credentialTypeLabels[credential.type]} - {credential.role}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="font-medium text-foreground">{credential.username}</div>
                        <div className="text-xs text-muted-foreground">{credential.passwordMask}</div>
                      </td>
                      <td className="px-3 py-3 align-top text-muted-foreground">{credential.scope}</td>
                      <td className="px-3 py-3 align-top">
                        <Badge variant="outline" className={credential.twoFactor ? "border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]" : "border-[#F5841F]/20 bg-[#F5841F]/10 text-[#F5841F]"}>
                          {credential.twoFactor ? "Activo" : "Pendiente"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 align-top text-muted-foreground">{credential.lastRotation}</td>
                      <td className="px-3 py-3 align-top text-muted-foreground">{credential.lastAccess}</td>
                      <td className="px-3 py-3 align-top">
                        <Badge variant="outline" className={credentialStatusStyles[credential.status]}>
                          {credential.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCredential(credential)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                              const shouldDelete = window.confirm(
                                `Eliminar la credencial "${credential.label}"?`,
                              );

                              if (shouldDelete) {
                                deleteCredential(credential.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Postura de seguridad</CardTitle>
              <CardDescription>
                Cobertura global del entorno administrativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">2FA habilitado</span>
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
              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
                <p>
                  {apiCredentials} credenciales API activas y {expiredCredentials} requieren rotacion inmediata.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cobertura por cliente</CardTitle>
              <CardDescription>
                Deteccion rapida de cuentas con mas deuda de seguridad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clients.map((client) => {
                const credentialStats = getClientCredentialStats(client);

                return (
                  <div key={client.id} className="rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{client.businessName}</p>
                        <p className="text-xs text-muted-foreground">
                          {credentialStats.total} credenciales - {credentialStats.review} en revision
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {credentialStats.coverage}%
                      </span>
                    </div>
                    <Progress
                      value={credentialStats.coverage}
                      className="mt-3 [&_[data-slot=progress-indicator]]:bg-[#3D7F35]"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <CredentialFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        clients={clients}
        onCreate={createCredential}
        onUpdate={updateCredential}
      />

      <CredentialFormDialog
        open={Boolean(editingCredential)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCredential(undefined);
          }
        }}
        clients={clients}
        initialCredential={editingCredential}
        onCreate={createCredential}
        onUpdate={updateCredential}
      />
    </div>
  );
}
