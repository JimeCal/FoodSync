import { adminClients, cloneAdminClients, type AdminClient } from "@/lib/admin-data";

export const ADMIN_STORAGE_KEY = "foodsync-admin-clients";

export const loadStoredAdminClients = (): AdminClient[] | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AdminClient[];
  } catch {
    return null;
  }
};

export const saveStoredAdminClients = (clients: AdminClient[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(clients));
};

export const loadAdminClientsSnapshot = () => {
  const storedClients = loadStoredAdminClients();

  return cloneAdminClients(storedClients ?? adminClients);
};
