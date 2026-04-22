export type PlatformUserRole = "admin" | "owner" | "manager" | "employee";
export type PlatformCredentialType = PlatformUserRole | "api";

export type PlatformPermission =
  | "accessAdmin"
  | "manageRecords"
  | "manageSettings"
  | "manageTeam"
  | "previewLocations"
  | "viewDashboard"
  | "viewHistory"
  | "viewMultilocal"
  | "viewRecommendations";

const rolePermissions: Record<PlatformUserRole, PlatformPermission[]> = {
  admin: ["accessAdmin", "previewLocations"],
  owner: [
    "manageRecords",
    "manageSettings",
    "manageTeam",
    "viewDashboard",
    "viewHistory",
    "viewMultilocal",
    "viewRecommendations",
  ],
  manager: [
    "manageRecords",
    "viewDashboard",
    "viewHistory",
    "viewMultilocal",
    "viewRecommendations",
  ],
  employee: [
    "manageRecords",
    "viewDashboard",
    "viewHistory",
    "viewRecommendations",
  ],
};

export const platformRoleLabels: Record<PlatformUserRole, string> = {
  admin: "Admin",
  owner: "Dueno",
  manager: "Gerente",
  employee: "Empleado",
};

export const credentialTypeLabels: Record<PlatformCredentialType, string> = {
  admin: "Admin",
  owner: "Dueno",
  manager: "Gerente",
  employee: "Empleado",
  api: "API",
};

export const platformPermissionLabels: Record<PlatformPermission, string> = {
  accessAdmin: "Acceso total al panel administrativo",
  manageRecords: "Registrar y editar produccion y ventas",
  manageSettings: "Configurar negocio, plan y preferencias",
  manageTeam: "Crear usuarios y cambiar roles del equipo",
  previewLocations: "Previsualizar cualquier local",
  viewDashboard: "Ver el dashboard operativo",
  viewHistory: "Consultar historico y exportaciones",
  viewMultilocal: "Supervisar varios locales",
  viewRecommendations: "Consultar recomendaciones inteligentes",
};

export const humanRoleOptions: Array<{ value: PlatformUserRole; label: string }> = [
  { value: "admin", label: platformRoleLabels.admin },
  { value: "owner", label: platformRoleLabels.owner },
  { value: "manager", label: platformRoleLabels.manager },
  { value: "employee", label: platformRoleLabels.employee },
];

export const staffRoleOptions: Array<{ value: Exclude<PlatformUserRole, "admin">; label: string }> = [
  { value: "owner", label: platformRoleLabels.owner },
  { value: "manager", label: platformRoleLabels.manager },
  { value: "employee", label: platformRoleLabels.employee },
];

export const credentialTypeOptions: Array<{ value: PlatformCredentialType; label: string }> = [
  { value: "admin", label: credentialTypeLabels.admin },
  { value: "owner", label: credentialTypeLabels.owner },
  { value: "manager", label: credentialTypeLabels.manager },
  { value: "employee", label: credentialTypeLabels.employee },
  { value: "api", label: credentialTypeLabels.api },
];

export function isHumanRole(role: PlatformCredentialType | string | undefined): role is PlatformUserRole {
  return role === "admin" || role === "owner" || role === "manager" || role === "employee";
}

export function hasRolePermission(
  role: PlatformUserRole | undefined,
  permission: PlatformPermission,
) {
  if (!role) {
    return false;
  }

  return rolePermissions[role].includes(permission);
}

export function getRolePermissions(role: PlatformUserRole | undefined) {
  if (!role) {
    return [];
  }

  return [...rolePermissions[role]];
}

export function getRolePermissionLabels(role: PlatformUserRole | undefined) {
  return getRolePermissions(role).map((permission) => platformPermissionLabels[permission]);
}
