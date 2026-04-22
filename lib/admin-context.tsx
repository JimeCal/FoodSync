"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockUser, type DailyRecord, type Location } from "@/lib/mock-data";
import {
  adminAlerts,
  adminClients as seedAdminClients,
  cloneAdminClients,
  deriveAdminOverview,
  deriveAdminPlanDistribution,
  deriveAdminWasteByClient,
  flattenAdminCredentials,
  flattenAdminLocations,
  syncClientAccessStats,
  type AdminClient,
  type AdminCredential,
  type AdminLocation,
} from "@/lib/admin-data";
import { loadAdminClientsSnapshot, saveStoredAdminClients } from "@/lib/admin-storage";

type NewLocationInput = Pick<
  AdminLocation,
  "clientId" | "name" | "type" | "city" | "manager" | "status" | "lastSync" | "connectedDevices" | "openIncidents" | "posProvider"
>;

type UpdateLocationInput = Partial<
  Pick<
    AdminLocation,
    "name" | "type" | "city" | "manager" | "status" | "lastSync" | "connectedDevices" | "openIncidents" | "posProvider"
  >
>;

type NewCredentialInput = {
  clientId: string;
  locationId?: string;
} & Pick<
  AdminCredential,
  "label" | "role" | "type" | "username" | "passwordMask" | "scope" | "twoFactor" | "lastRotation" | "lastAccess" | "status"
>;

type UpdateCredentialInput = Partial<
  Pick<
    AdminCredential,
    | "clientId"
    | "locationId"
    | "label"
    | "role"
    | "type"
    | "username"
    | "passwordMask"
    | "scope"
    | "twoFactor"
    | "lastRotation"
    | "lastAccess"
    | "status"
  >
>;

interface AdminContextValue {
  clients: AdminClient[];
  locations: AdminLocation[];
  credentials: AdminCredential[];
  overview: ReturnType<typeof deriveAdminOverview>;
  planDistribution: ReturnType<typeof deriveAdminPlanDistribution>;
  wasteByClient: ReturnType<typeof deriveAdminWasteByClient>;
  alerts: typeof adminAlerts;
  createLocation: (input: NewLocationInput) => void;
  updateLocation: (locationId: string, updates: UpdateLocationInput) => void;
  deleteLocation: (locationId: string) => void;
  createCredential: (input: NewCredentialInput) => void;
  updateCredential: (credentialId: string, updates: UpdateCredentialInput) => void;
  deleteCredential: (credentialId: string) => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const starterRecords = mockUser.locations[0]?.records ?? [];

const buildStarterRecords = (seed: number): DailyRecord[] =>
  starterRecords.map((record, index) => {
    const produced = Math.max(60, record.produced + (seed % 9) - 4 + (index % 3));
    const sold = Math.min(produced, Math.max(45, record.sold + (seed % 7) - 3));
    const wasted = Math.max(0, produced - sold);
    const wastePercentage = Math.round((wasted / produced) * 1000) / 10;

    return {
      ...record,
      id: `seed-${seed}-${index}`,
      produced,
      sold,
      wasted,
      wastePercentage,
    };
  });

const findClientForLocation = (clients: AdminClient[], locationId?: string) => {
  if (!locationId) {
    return undefined;
  }

  return clients.find((client) => client.locations.some((location) => location.id === locationId));
};

const buildLocationName = (client: AdminClient | undefined, locationId?: string) => {
  if (!client || !locationId) {
    return undefined;
  }

  return client.locations.find((location) => location.id === locationId)?.name;
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<AdminClient[]>(() => cloneAdminClients(seedAdminClients));
  const [hasLoadedStoredClients, setHasLoadedStoredClients] = useState(false);

  useEffect(() => {
    setClients(loadAdminClientsSnapshot());
    setHasLoadedStoredClients(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredClients) {
      return;
    }

    saveStoredAdminClients(clients);
  }, [clients, hasLoadedStoredClients]);

  const locations = flattenAdminLocations(clients);
  const credentials = flattenAdminCredentials(clients);
  const overview = deriveAdminOverview(clients);
  const planDistribution = deriveAdminPlanDistribution(clients);
  const wasteByClient = deriveAdminWasteByClient(clients);

  const createLocation = (input: NewLocationInput) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== input.clientId) {
          return client;
        }

        const nextIndex = client.locations.length + 1;
        const locationId = `${client.id}-loc-${Date.now()}`;
        const newLocation: AdminLocation = {
          id: locationId,
          clientId: client.id,
          clientName: client.businessName,
          name: input.name,
          type: input.type as Location["type"],
          city: input.city,
          manager: input.manager,
          status: input.status,
          lastSync: input.lastSync,
          connectedDevices: input.connectedDevices,
          openIncidents: input.openIncidents,
          posProvider: input.posProvider,
          records: buildStarterRecords(nextIndex),
        };

        return {
          ...client,
          locations: [...client.locations, newLocation],
        };
      }),
    );
  };

  const updateLocation = (locationId: string, updates: UpdateLocationInput) => {
    setClients((prev) =>
      prev.map((client) => ({
        ...client,
        locations: client.locations.map((location) =>
          location.id === locationId
            ? {
                ...location,
                ...updates,
              }
            : location,
        ),
      })),
    );
  };

  const deleteLocation = (locationId: string) => {
    setClients((prev) =>
      prev.map((client) =>
        syncClientAccessStats({
          ...client,
          locations: client.locations.filter((location) => location.id !== locationId),
          credentials: client.credentials.filter((credential) => credential.locationId !== locationId),
        }),
      ),
    );
  };

  const createCredential = (input: NewCredentialInput) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== input.clientId) {
          return client;
        }

        const targetLocation = input.locationId
          ? client.locations.find((location) => location.id === input.locationId)
          : undefined;

        const newCredential: AdminCredential = {
          id: `${client.id}-cred-${Date.now()}`,
          clientId: client.id,
          clientName: client.businessName,
          locationId: input.locationId,
          locationName: targetLocation?.name,
          label: input.label,
          role: input.role,
          type: input.type,
          username: input.username,
          passwordMask: input.passwordMask,
          scope: input.scope,
          twoFactor: input.twoFactor,
          lastRotation: input.lastRotation,
          lastAccess: input.lastAccess,
          status: input.status,
        };

        return syncClientAccessStats({
          ...client,
          credentials: [...client.credentials, newCredential],
        });
      }),
    );
  };

  const updateCredential = (credentialId: string, updates: UpdateCredentialInput) => {
    setClients((prev) => {
      const currentCredential = prev
        .flatMap((client) => client.credentials)
        .find((credential) => credential.id === credentialId);

      if (!currentCredential) {
        return prev;
      }

      const targetClientId = updates.clientId ?? currentCredential.clientId;
      const targetClient = prev.find((client) => client.id === targetClientId);
      const targetLocationId =
        updates.locationId === ""
          ? undefined
          : updates.locationId !== undefined
            ? updates.locationId
            : currentCredential.locationId;
      const targetLocationClient =
        findClientForLocation(prev, targetLocationId) ?? targetClient;

      const normalizedClient =
        targetLocationClient && targetLocationClient.id !== targetClientId
          ? targetLocationClient
          : targetClient;

      if (!normalizedClient) {
        return prev;
      }

      const nextCredential: AdminCredential = {
        ...currentCredential,
        ...updates,
        clientId: normalizedClient.id,
        clientName: normalizedClient.businessName,
        locationId: targetLocationId,
        locationName: buildLocationName(normalizedClient, targetLocationId),
      };

      return prev.map((client) => {
        const filteredCredentials = client.credentials.filter(
          (credential) => credential.id !== credentialId,
        );

        if (client.id === normalizedClient.id) {
          return syncClientAccessStats({
            ...client,
            credentials: [...filteredCredentials, nextCredential],
          });
        }

        return syncClientAccessStats({
          ...client,
          credentials: filteredCredentials,
        });
      });
    });
  };

  const deleteCredential = (credentialId: string) => {
    setClients((prev) =>
      prev.map((client) =>
        syncClientAccessStats({
          ...client,
          credentials: client.credentials.filter((credential) => credential.id !== credentialId),
        }),
      ),
    );
  };

  return (
    <AdminContext.Provider
      value={{
        clients,
        locations,
        credentials,
        overview,
        planDistribution,
        wasteByClient,
        alerts: adminAlerts,
        createLocation,
        updateLocation,
        deleteLocation,
        createCredential,
        updateCredential,
        deleteCredential,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
}
