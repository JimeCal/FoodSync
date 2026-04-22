"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { AccessDenied } from "@/components/access-denied";
import { usePlatformSession } from "@/lib/platform-session";
import type { PlatformPermission } from "@/lib/role-permissions";

interface PermissionGateProps {
  children: ReactNode;
  description?: string;
  href?: string;
  permission?: PlatformPermission;
  requireAdmin?: boolean;
  title?: string;
}

export function PermissionGate({
  children,
  description = "Tu rol actual no tiene acceso a esta seccion.",
  href = "/dashboard",
  permission,
  requireAdmin = false,
  title = "No tienes permisos para acceder aqui",
}: PermissionGateProps) {
  const { hasPermission, isReady, session } = usePlatformSession();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm text-muted-foreground shadow-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#3D7F35]" />
          Cargando permisos...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AccessDenied
        title="Necesitas iniciar sesion"
        description="Inicia sesion con una credencial valida para entrar a la plataforma."
        href="/"
      />
    );
  }

  if (requireAdmin && !hasPermission("accessAdmin")) {
    return (
      <AccessDenied
        title="Esta area es solo para administradores"
        description="Tu usuario actual no pertenece al panel interno de FoodSync."
        href={session.role === "admin" ? "/admin" : "/dashboard"}
      />
    );
  }

  if (!requireAdmin && session.role === "admin") {
    return (
      <AccessDenied
        title="Este acceso usa el panel interno"
        description="Los administradores deben trabajar desde la vista interna y no desde el dashboard del cliente."
        href="/admin"
      />
    );
  }

  if (permission && !hasPermission(permission)) {
    return <AccessDenied title={title} description={description} href={href} />;
  }

  return <>{children}</>;
}
