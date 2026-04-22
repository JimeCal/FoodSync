import {
  calculateRecommendation,
  calculateStats,
  mockMultiLocationUser,
  mockUser,
  type DailyRecord,
  type Location,
} from "@/lib/mock-data";
import type { PlatformCredentialType } from "@/lib/role-permissions";

type PlanId = "basic" | "plus" | "premium";

export type ClientStatus = "saludable" | "atencion" | "critico";
export type LocationStatus = "operativo" | "atencion" | "sincronizando" | "incidencia";
export type CredentialStatus = "segura" | "revision" | "caducada";
export type AlertSeverity = "info" | "warning" | "critical";

export interface AdminLocation extends Location {
  clientId: string;
  clientName: string;
  city: string;
  manager: string;
  status: LocationStatus;
  lastSync: string;
  connectedDevices: number;
  openIncidents: number;
  posProvider: string;
}

export interface AdminCredential {
  id: string;
  clientId: string;
  clientName: string;
  locationId?: string;
  locationName?: string;
  label: string;
  role: string;
  type: PlatformCredentialType;
  username: string;
  passwordMask: string;
  scope: string;
  twoFactor: boolean;
  lastRotation: string;
  lastAccess: string;
  status: CredentialStatus;
}

export interface AdminClient {
  id: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  industry: string;
  plan: PlanId;
  status: ClientStatus;
  supportTier: "estandar" | "prioritario" | "dedicado";
  accountManager: string;
  contractSince: string;
  renewalDate: string;
  monthlyFee: number;
  activeUsers: number;
  seatsUsed: number;
  lastAccess: string;
  notes: string;
  tags: string[];
  locations: AdminLocation[];
  credentials: AdminCredential[];
}

export interface AdminAlert {
  id: string;
  severity: AlertSeverity;
  category: "credenciales" | "desperdicio" | "locales" | "facturacion";
  title: string;
  description: string;
  target: string;
  timestamp: string;
  clientId?: string;
}

const makeRecords = (
  prefix: string,
  baseRecords: DailyRecord[],
  config: { producedOffset: number; soldOffset: number; variance: number },
): DailyRecord[] => {
  return baseRecords.map((record, index) => {
    const productionVariance = ((index % 3) - 1) * config.variance;
    const salesVariance = (((index + 1) % 4) - 1.5) * Math.max(1, Math.round(config.variance / 2));
    const produced = Math.max(70, Math.round(record.produced + config.producedOffset + productionVariance));
    const sold = Math.min(
      produced,
      Math.max(55, Math.round(record.sold + config.soldOffset + salesVariance)),
    );
    const wasted = Math.max(0, produced - sold);
    const wastePercentage = Math.round((wasted / produced) * 1000) / 10;

    return {
      ...record,
      id: `${prefix}-${index}`,
      produced,
      sold,
      wasted,
      wastePercentage,
    };
  });
};

const buildLocation = (
  clientId: string,
  clientName: string,
  location: Location,
  meta: Omit<
    AdminLocation,
    "clientId" | "clientName" | "id" | "name" | "type" | "records"
  >,
): AdminLocation => ({
  ...location,
  clientId,
  clientName,
  ...meta,
});

const buenPanLocations: AdminLocation[] = [
  buildLocation(
    "client-1",
    mockUser.businessName,
    {
      ...mockUser.locations[0],
      id: "client-1-loc-1",
    },
    {
      city: "Madrid",
      manager: "Lucia Soto",
      status: "operativo",
      lastSync: "Hace 4 min",
      connectedDevices: 4,
      openIncidents: 0,
      posProvider: "Square",
    },
  ),
];

const cafeDeliciaLocations: AdminLocation[] = [
  buildLocation(
    "client-2",
    mockMultiLocationUser.businessName,
    {
      ...mockMultiLocationUser.locations[0],
      id: "client-2-loc-1",
    },
    {
      city: "Madrid",
      manager: "Ana Morales",
      status: "operativo",
      lastSync: "Hace 2 min",
      connectedDevices: 6,
      openIncidents: 0,
      posProvider: "Glop",
    },
  ),
  buildLocation(
    "client-2",
    mockMultiLocationUser.businessName,
    {
      ...mockMultiLocationUser.locations[1],
      id: "client-2-loc-2",
    },
    {
      city: "Madrid",
      manager: "Jorge Vega",
      status: "atencion",
      lastSync: "Hace 12 min",
      connectedDevices: 5,
      openIncidents: 1,
      posProvider: "Glop",
    },
  ),
  buildLocation(
    "client-2",
    mockMultiLocationUser.businessName,
    {
      ...mockMultiLocationUser.locations[2],
      id: "client-2-loc-3",
    },
    {
      city: "Madrid",
      manager: "Sonia Rey",
      status: "sincronizando",
      lastSync: "Sincronizando desde hace 18 min",
      connectedDevices: 5,
      openIncidents: 1,
      posProvider: "Glop",
    },
  ),
];

const costaNorteLocations: AdminLocation[] = [
  buildLocation(
    "client-3",
    "Restaurante Costa Norte",
    {
      id: "client-3-loc-1",
      name: "Costa Norte - Malaga Centro",
      type: "restaurante",
      records: makeRecords("costa-norte-centro", mockMultiLocationUser.locations[2].records, {
        producedOffset: 26,
        soldOffset: 18,
        variance: 5,
      }),
    },
    {
      city: "Malaga",
      manager: "Diego Marin",
      status: "operativo",
      lastSync: "Hace 7 min",
      connectedDevices: 7,
      openIncidents: 0,
      posProvider: "Last.app",
    },
  ),
  buildLocation(
    "client-3",
    "Restaurante Costa Norte",
    {
      id: "client-3-loc-2",
      name: "Costa Norte - Puerto",
      type: "restaurante",
      records: makeRecords("costa-norte-puerto", mockMultiLocationUser.locations[0].records, {
        producedOffset: 18,
        soldOffset: 1,
        variance: 7,
      }),
    },
    {
      city: "Malaga",
      manager: "Paula Ortega",
      status: "incidencia",
      lastSync: "Ultima sincronizacion hace 44 min",
      connectedDevices: 4,
      openIncidents: 2,
      posProvider: "Last.app",
    },
  ),
];

const dulceBarrioLocations: AdminLocation[] = [
  buildLocation(
    "client-4",
    "Dulce Barrio",
    {
      id: "client-4-loc-1",
      name: "Dulce Barrio - Sevilla Centro",
      type: "panaderia",
      records: makeRecords("dulce-barrio-centro", mockUser.locations[0].records, {
        producedOffset: -12,
        soldOffset: -7,
        variance: 3,
      }),
    },
    {
      city: "Sevilla",
      manager: "Marta Cano",
      status: "operativo",
      lastSync: "Hace 6 min",
      connectedDevices: 3,
      openIncidents: 0,
      posProvider: "Square",
    },
  ),
];

const verdeVivoLocations: AdminLocation[] = [
  buildLocation(
    "client-5",
    "Verde Vivo Kitchen",
    {
      id: "client-5-loc-1",
      name: "Verde Vivo - Poblenou",
      type: "restaurante",
      records: makeRecords("verde-vivo-poblenou", mockMultiLocationUser.locations[1].records, {
        producedOffset: 9,
        soldOffset: 12,
        variance: 4,
      }),
    },
    {
      city: "Barcelona",
      manager: "Nora Vidal",
      status: "atencion",
      lastSync: "Hace 15 min",
      connectedDevices: 6,
      openIncidents: 1,
      posProvider: "CoverManager",
    },
  ),
];

const buenPanCredentials: AdminCredential[] = [
  {
    id: "cred-client-1-owner",
    clientId: "client-1",
    clientName: mockUser.businessName,
    locationId: "client-1-loc-1",
    locationName: "Panaderia Central",
    label: "Acceso principal",
    role: "Propietaria",
    type: "owner",
    username: "demo@foodsync.es",
    passwordMask: "demo123",
    scope: "Dashboard cliente",
    twoFactor: false,
    lastRotation: "2026-01-15",
    lastAccess: "Hoy 09:14",
    status: "revision",
  },
  {
    id: "cred-client-1-manager",
    clientId: "client-1",
    clientName: mockUser.businessName,
    locationId: "client-1-loc-1",
    locationName: "Panaderia Central",
    label: "Tablet de caja",
    role: "Encargada",
    type: "manager",
    username: "central@foodsync.es",
    passwordMask: "********",
    scope: "Registro diario",
    twoFactor: false,
    lastRotation: "2025-12-02",
    lastAccess: "Hoy 07:55",
    status: "revision",
  },
  {
    id: "cred-client-1-employee",
    clientId: "client-1",
    clientName: mockUser.businessName,
    locationId: "client-1-loc-1",
    locationName: "Panaderia Central",
    label: "Operador de mostrador",
    role: "Empleado de caja",
    type: "employee",
    username: "empleado@foodsync.es",
    passwordMask: "empleado123",
    scope: "Registro de produccion y ventas",
    twoFactor: false,
    lastRotation: "2026-02-20",
    lastAccess: "Hoy 08:05",
    status: "segura",
  },
];

const cafeDeliciaCredentials: AdminCredential[] = [
  {
    id: "cred-client-2-owner",
    clientId: "client-2",
    clientName: mockMultiLocationUser.businessName,
    label: "Owner premium",
    role: "Director de operaciones",
    type: "owner",
    username: "franquicia@foodsync.es",
    passwordMask: "********",
    scope: "Dashboard multi-local",
    twoFactor: true,
    lastRotation: "2026-03-28",
    lastAccess: "Hoy 08:42",
    status: "segura",
  },
  {
    id: "cred-client-2-api",
    clientId: "client-2",
    clientName: mockMultiLocationUser.businessName,
    label: "API inventario",
    role: "Integracion POS",
    type: "api",
    username: "cafedelicia-pos",
    passwordMask: "tok_live_****A92",
    scope: "Sincronizacion stock",
    twoFactor: true,
    lastRotation: "2026-02-17",
    lastAccess: "Hoy 08:39",
    status: "segura",
  },
  {
    id: "cred-client-2-manager",
    clientId: "client-2",
    clientName: mockMultiLocationUser.businessName,
    locationId: "client-2-loc-3",
    locationName: "Cafe Delicia - Estacion",
    label: "Gerencia local",
    role: "Manager de tienda",
    type: "manager",
    username: "estacion@foodsync.es",
    passwordMask: "********",
    scope: "Panel del local",
    twoFactor: false,
    lastRotation: "2025-11-09",
    lastAccess: "Ayer 21:10",
    status: "revision",
  },
];

const costaNorteCredentials: AdminCredential[] = [
  {
    id: "cred-client-3-owner",
    clientId: "client-3",
    clientName: "Restaurante Costa Norte",
    label: "Propiedad",
    role: "CEO",
    type: "owner",
    username: "direccion@costanorte.es",
    passwordMask: "********",
    scope: "Cuenta principal",
    twoFactor: true,
    lastRotation: "2026-04-02",
    lastAccess: "Hoy 06:58",
    status: "segura",
  },
  {
    id: "cred-client-3-api",
    clientId: "client-3",
    clientName: "Restaurante Costa Norte",
    locationId: "client-3-loc-2",
    locationName: "Costa Norte - Puerto",
    label: "API reservas",
    role: "Webhook externo",
    type: "api",
    username: "costa-puerto-reservas",
    passwordMask: "tok_live_****X11",
    scope: "Reservas y caja",
    twoFactor: false,
    lastRotation: "2025-10-21",
    lastAccess: "Hace 47 min",
    status: "caducada",
  },
  {
    id: "cred-client-3-support",
    clientId: "client-3",
    clientName: "Restaurante Costa Norte",
    label: "Acceso soporte",
    role: "Soporte FoodSync",
    type: "admin",
    username: "support-costa",
    passwordMask: "vault://foodsync/costa",
    scope: "Admin y diagnostico remoto",
    twoFactor: true,
    lastRotation: "2026-03-03",
    lastAccess: "Hace 19 min",
    status: "segura",
  },
];

const dulceBarrioCredentials: AdminCredential[] = [
  {
    id: "cred-client-4-owner",
    clientId: "client-4",
    clientName: "Dulce Barrio",
    label: "Cuenta fundadora",
    role: "Propietaria",
    type: "owner",
    username: "hola@dulcebarrio.es",
    passwordMask: "********",
    scope: "Dashboard cliente",
    twoFactor: true,
    lastRotation: "2026-03-12",
    lastAccess: "Hoy 09:02",
    status: "segura",
  },
];

const verdeVivoCredentials: AdminCredential[] = [
  {
    id: "cred-client-5-owner",
    clientId: "client-5",
    clientName: "Verde Vivo Kitchen",
    label: "Founder access",
    role: "Fundadora",
    type: "owner",
    username: "ops@verdevivo.es",
    passwordMask: "********",
    scope: "Dashboard cliente",
    twoFactor: true,
    lastRotation: "2026-03-18",
    lastAccess: "Hoy 08:27",
    status: "segura",
  },
  {
    id: "cred-client-5-manager",
    clientId: "client-5",
    clientName: "Verde Vivo Kitchen",
    locationId: "client-5-loc-1",
    locationName: "Verde Vivo - Poblenou",
    label: "Supervisor de local",
    role: "Manager",
    type: "manager",
    username: "poblenou@foodsync.es",
    passwordMask: "********",
    scope: "Registro y reportes",
    twoFactor: false,
    lastRotation: "2025-12-10",
    lastAccess: "Ayer 23:16",
    status: "revision",
  },
];

export const adminClients: AdminClient[] = [
  {
    id: "client-1",
    businessName: mockUser.businessName,
    ownerName: mockUser.name,
    ownerEmail: mockUser.email,
    industry: "Panaderia",
    plan: "plus",
    status: "saludable",
    supportTier: "prioritario",
    accountManager: "Elena Ruiz",
    contractSince: "2025-09-12",
    renewalDate: "2026-05-01",
    monthlyFee: 80,
    activeUsers: 3,
    seatsUsed: 3,
    lastAccess: "Hoy 09:14",
    notes: "Cliente muy estable. Usa la recomendacion diaria casi todos los dias.",
    tags: ["alto uso", "caso demo", "seguimiento ligero"],
    locations: buenPanLocations,
    credentials: buenPanCredentials,
  },
  {
    id: "client-2",
    businessName: mockMultiLocationUser.businessName,
    ownerName: mockMultiLocationUser.name,
    ownerEmail: mockMultiLocationUser.email,
    industry: "Cafeteria",
    plan: "premium",
    status: "atencion",
    supportTier: "dedicado",
    accountManager: "Mario Salas",
    contractSince: "2025-04-20",
    renewalDate: "2026-06-15",
    monthlyFee: 279,
    activeUsers: 11,
    seatsUsed: 11,
    lastAccess: "Hoy 08:42",
    notes: "Buen expansion multi-local. Un local presenta retrasos de sincronizacion.",
    tags: ["franquicia", "multi-local", "soporte dedicado"],
    locations: cafeDeliciaLocations,
    credentials: cafeDeliciaCredentials,
  },
  {
    id: "client-3",
    businessName: "Restaurante Costa Norte",
    ownerName: "Adrian Flores",
    ownerEmail: "direccion@costanorte.es",
    industry: "Restaurante",
    plan: "premium",
    status: "critico",
    supportTier: "dedicado",
    accountManager: "Clara Nunez",
    contractSince: "2025-01-11",
    renewalDate: "2026-05-20",
    monthlyFee: 186,
    activeUsers: 8,
    seatsUsed: 10,
    lastAccess: "Hoy 06:58",
    notes: "Hay que revisar una API vencida y un local con incidencia operativa.",
    tags: ["riesgo alto", "API externa", "seguimiento diario"],
    locations: costaNorteLocations,
    credentials: costaNorteCredentials,
  },
  {
    id: "client-4",
    businessName: "Dulce Barrio",
    ownerName: "Marta Cano",
    ownerEmail: "hola@dulcebarrio.es",
    industry: "Pasteleria",
    plan: "basic",
    status: "saludable",
    supportTier: "estandar",
    accountManager: "Paula Gomez",
    contractSince: "2026-01-08",
    renewalDate: "2026-07-08",
    monthlyFee: 40,
    activeUsers: 2,
    seatsUsed: 2,
    lastAccess: "Hoy 09:02",
    notes: "Cliente pequeno pero constante. Potencial claro para upgrade a Plus.",
    tags: ["upsell plus", "uso moderado"],
    locations: dulceBarrioLocations,
    credentials: dulceBarrioCredentials,
  },
  {
    id: "client-5",
    businessName: "Verde Vivo Kitchen",
    ownerName: "Nora Vidal",
    ownerEmail: "ops@verdevivo.es",
    industry: "Healthy food",
    plan: "plus",
    status: "atencion",
    supportTier: "prioritario",
    accountManager: "Sergio Lara",
    contractSince: "2025-11-05",
    renewalDate: "2026-05-30",
    monthlyFee: 80,
    activeUsers: 4,
    seatsUsed: 5,
    lastAccess: "Hoy 08:27",
    notes: "Buen comportamiento comercial, pero falta cerrar 2FA del manager local.",
    tags: ["onboarding avanzado", "seguridad pendiente"],
    locations: verdeVivoLocations,
    credentials: verdeVivoCredentials,
  },
];

export const cloneAdminClients = (clients: AdminClient[]) =>
  clients.map((client) => ({
    ...client,
    tags: [...client.tags],
    locations: client.locations.map((location) => ({
      ...location,
      records: location.records.map((record) => ({ ...record })),
    })),
    credentials: client.credentials.map((credential) => ({ ...credential })),
  }));

export const flattenAdminLocations = (clients: AdminClient[]) =>
  clients.flatMap((client) => client.locations);

export const flattenAdminCredentials = (clients: AdminClient[]) =>
  clients.flatMap((client) => client.credentials);

export const syncClientAccessStats = (client: AdminClient): AdminClient => {
  const humanCredentials = client.credentials.filter((credential) => credential.type !== "api");
  const activeHumanCredentials = humanCredentials.filter(
    (credential) => credential.status !== "caducada",
  );

  return {
    ...client,
    activeUsers: activeHumanCredentials.length,
    seatsUsed: humanCredentials.length,
  };
};

export const getClientAggregateStats = (client: AdminClient) =>
  calculateStats(client.locations.flatMap((location) => location.records));

export const getClientCredentialStats = (client: AdminClient) => {
  const total = client.credentials.length;
  const secure = client.credentials.filter((credential) => credential.status === "segura").length;
  const review = client.credentials.filter((credential) => credential.status === "revision").length;
  const expired = client.credentials.filter((credential) => credential.status === "caducada").length;
  const coverage = total === 0 ? 0 : Math.round((client.credentials.filter((credential) => credential.twoFactor).length / total) * 100);

  return { total, secure, review, expired, coverage };
};

export const getLocationTodayRecord = (location: AdminLocation) =>
  location.records[location.records.length - 1];

export const getLocationRecommendation = (location: AdminLocation) =>
  calculateRecommendation(location.records);

export const deriveAdminOverview = (clients: AdminClient[]) => {
  const adminLocations = flattenAdminLocations(clients);
  const adminCredentials = flattenAdminCredentials(clients);
  const totalCredentials = adminCredentials.length;
  const secureCredentials = adminCredentials.filter((credential) => credential.status === "segura").length;
  const credentialsWith2FA = adminCredentials.filter((credential) => credential.twoFactor).length;
  const operationalLocations = adminLocations.filter((location) => location.status === "operativo").length;
  const locationsRequiringAttention = adminLocations.filter((location) => location.openIncidents > 0).length;
  const totalOpenIncidents = adminLocations.reduce((total, location) => total + location.openIncidents, 0);
  const platformStats = calculateStats(adminLocations.flatMap((location) => location.records));

  return {
    totalClients: clients.length,
    totalLocations: adminLocations.length,
    totalCredentials,
    monthlyRevenue: clients.reduce((total, client) => total + client.monthlyFee, 0),
    avgWastePercentage: platformStats.avgWastePercentage,
    clientsNeedingAttention: clients.filter((client) => client.status !== "saludable").length,
    totalOpenIncidents,
    secureCredentialCoverage:
      totalCredentials === 0 ? 0 : Math.round((secureCredentials / totalCredentials) * 100),
    twoFactorCoverage:
      totalCredentials === 0 ? 0 : Math.round((credentialsWith2FA / totalCredentials) * 100),
    operationalCoverage:
      adminLocations.length === 0 ? 0 : Math.round((operationalLocations / adminLocations.length) * 100),
    locationsRequiringAttention,
  };
};

export const deriveAdminPlanDistribution = (clients: AdminClient[]) => [
  {
    plan: "Basico",
    clients: clients.filter((client) => client.plan === "basic").length,
    monthlyRevenue: clients
      .filter((client) => client.plan === "basic")
      .reduce((total, client) => total + client.monthlyFee, 0),
  },
  {
    plan: "Plus",
    clients: clients.filter((client) => client.plan === "plus").length,
    monthlyRevenue: clients
      .filter((client) => client.plan === "plus")
      .reduce((total, client) => total + client.monthlyFee, 0),
  },
  {
    plan: "Premium",
    clients: clients.filter((client) => client.plan === "premium").length,
    monthlyRevenue: clients
      .filter((client) => client.plan === "premium")
      .reduce((total, client) => total + client.monthlyFee, 0),
  },
];

export const deriveAdminWasteByClient = (clients: AdminClient[]) =>
  clients.map((client) => ({
  clientId: client.id,
  client: client.businessName
    .replace("Panaderia ", "")
    .replace("Restaurante ", "")
    .replace("Kitchen", "Kitchen")
    .trim(),
  desperdicio: getClientAggregateStats(client).avgWastePercentage,
  ingresos: client.monthlyFee,
  }));

export const adminLocations = flattenAdminLocations(adminClients);
export const adminCredentials = flattenAdminCredentials(adminClients);
export const adminOverview = deriveAdminOverview(adminClients);
export const adminPlanDistribution = deriveAdminPlanDistribution(adminClients);
export const adminWasteByClient = deriveAdminWasteByClient(adminClients);

export const adminAlerts: AdminAlert[] = [
  {
    id: "alert-1",
    severity: "critical",
    category: "credenciales",
    title: "API vencida en Costa Norte",
    description: "La credencial de reservas del local Puerto supero el tiempo maximo de rotacion.",
    target: "Costa Norte - Puerto",
    timestamp: "Hace 18 min",
    clientId: "client-3",
  },
  {
    id: "alert-2",
    severity: "warning",
    category: "locales",
    title: "Sincronizacion lenta en Cafe Delicia",
    description: "El local Estacion mantiene retraso de sincronizacion y una incidencia abierta.",
    target: "Cafe Delicia - Estacion",
    timestamp: "Hace 32 min",
    clientId: "client-2",
  },
  {
    id: "alert-3",
    severity: "warning",
    category: "desperdicio",
    title: "Desperdicio por encima del objetivo",
    description: "El promedio semanal del local Puerto esta por encima del objetivo recomendado del 10%.",
    target: "Costa Norte - Puerto",
    timestamp: "Hace 44 min",
    clientId: "client-3",
  },
  {
    id: "alert-4",
    severity: "info",
    category: "credenciales",
    title: "2FA pendiente en Verde Vivo",
    description: "El acceso del manager local sigue sin doble factor activado.",
    target: "Verde Vivo - Poblenou",
    timestamp: "Hace 1 h",
    clientId: "client-5",
  },
  {
    id: "alert-5",
    severity: "info",
    category: "facturacion",
    title: "Cliente listo para upgrade",
    description: "Dulce Barrio esta cerca del limite operativo del plan Basico y tiene potencial para pasar a Plus.",
    target: "Dulce Barrio",
    timestamp: "Hace 3 h",
    clientId: "client-4",
  },
];
