"use client";

import { useState } from "react";
import { Users, UserPlus, Mail, Shield, Trash2, Edit2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const teamMembers = [
  {
    id: "1",
    name: "Diego García",
    email: "diego@levaduramadre.es",
    role: "Gerente",
    location: "Tienda Centro",
    joinDate: "15 de marzo, 2024",
    status: "activo",
    initials: "DG",
  },
  {
    id: "2",
    name: "Ana López",
    email: "ana@levaduramadre.es",
    role: "Responsable Obrador",
    location: "Obrador",
    joinDate: "15 de marzo, 2024",
    status: "activo",
    initials: "AL",
  },
  {
    id: "3",
    name: "Carlos Martínez",
    email: "carlos@levaduramadre.es",
    role: "Operario",
    location: "Tienda Centro",
    joinDate: "1 de abril, 2024",
    status: "activo",
    initials: "CM",
  },
  {
    id: "4",
    name: "Isabel Ruiz",
    email: "isabel@levaduramadre.es",
    role: "Operaria",
    location: "Tienda Norte",
    joinDate: "8 de abril, 2024",
    status: "activo",
    initials: "IR",
  },
];

const rolePermissions = {
  Gerente: ["Ver todo", "Editar datos", "Invitar usuarios", "Ver reportes"],
  "Responsable Obrador": ["Ver datos", "Registrar producción", "Ver reportes propios"],
  Operario: ["Registrar datos", "Ver dashboard"],
};

export default function EquipoSection() {
  const [pendingInvitations, setPendingInvitations] = useState([
    {
      id: "1",
      email: "maria@levaduramadre.es",
      role: "Responsable Obrador",
    }
  ]);
  const { toast } = useToast();

  const handleResendInvitation = async (invitationId: string) => {
    try {
      // Simular envío de invitación
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Invitación reenviada",
        description: "La invitación ha sido reenviada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al reenviar invitación",
        description: "Ha ocurrido un error al reenviar la invitación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // Simular cancelación de invitación
      await new Promise(resolve => setTimeout(resolve, 500));

      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));

      toast({
        title: "Invitación cancelada",
        description: "La invitación ha sido cancelada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al cancelar invitación",
        description: "Ha ocurrido un error al cancelar la invitación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Equipo
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Gestiona tu equipo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Invita miembros del equipo y asigna roles y permisos para acceder a la plataforma.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-[#3D7F35]" />
              Miembros del equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {teamMembers.filter((m) => m.status === "activo").length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Slots disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#F5841F]">6</div>
            <p className="text-xs text-muted-foreground mt-1">de tu plan Plus (máx 10)</p>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de demo */}
      <Card className="border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-amber-700 dark:text-amber-400">Modo presentación</p>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                La gestión de equipo está bloqueada para mantener la integridad de la demostración.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de miembros */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Miembros del equipo</CardTitle>
            <CardDescription>Gestiona acceso y permisos de tu equipo</CardDescription>
          </div>
          <Button className="gap-2 bg-[#3D7F35] hover:bg-[#346B2D] opacity-75 cursor-not-allowed" disabled>
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Modo demo</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-border hover:border-[#3D7F35]/50 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarFallback className="bg-[#3D7F35]/10 text-[#3D7F35]">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35]">
                        {member.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{member.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <Badge
                    variant="outline"
                    className="bg-green-50/50 border-green-200/50 text-green-700 dark:bg-green-950/20 dark:border-green-800/50 dark:text-green-400"
                  >
                    ● {member.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="opacity-50 cursor-not-allowed" disabled>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive opacity-50 cursor-not-allowed" disabled>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles y permisos */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Roles y permisos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#3D7F35]" />
                  {role}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3D7F35]" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Invitaciones pendientes */}
      <Card className="border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
        <CardHeader>
          <CardTitle className="text-base">Invitaciones pendientes</CardTitle>
          <CardDescription>Usuarios invitados que aún no han aceptado</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length > 0 ? (
            pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-amber-200/30 dark:border-amber-800/30 rounded-lg gap-3">
                <div>
                  <p className="font-semibold text-foreground">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">Invitada como {invitation.role}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendInvitation(invitation.id)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleCancelInvitation(invitation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No hay invitaciones pendientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
