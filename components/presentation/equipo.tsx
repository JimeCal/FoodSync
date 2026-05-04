"use client";

import { Users, UserPlus, Mail, Shield, Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

      {/* Lista de miembros */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Miembros del equipo</CardTitle>
            <CardDescription>Gestiona acceso y permisos de tu equipo</CardDescription>
          </div>
          <Button className="gap-2 bg-[#3D7F35] hover:bg-[#346B2D]">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invitar miembro</span>
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
                  <Button size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-amber-200/30 dark:border-amber-800/30 rounded-lg gap-3">
            <div>
              <p className="font-semibold text-foreground">maria@levaduramadre.es</p>
              <p className="text-sm text-muted-foreground">Invitada como Responsable Obrador</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
