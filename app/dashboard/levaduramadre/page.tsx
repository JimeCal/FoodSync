"use client";

import { LevaduramadreDashboard } from "@/components/levaduramadre-dashboard";
import { PermissionGate } from "@/components/permission-gate";

export default function LevaduramadreDashboardPage() {
  return (
    <PermissionGate
      permission="viewDashboard"
      title="Tu rol no puede abrir el dashboard"
      description="Esta vista esta reservada para usuarios con acceso operativo al panel del cliente."
    >
      <LevaduramadreDashboard showBackLink />
    </PermissionGate>
  );
}
