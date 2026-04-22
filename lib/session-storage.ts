import type { PlatformUserRole } from "@/lib/role-permissions";

export interface PlatformSession {
  credentialId: string;
  clientId?: string;
  email: string;
  locationId?: string;
  role: PlatformUserRole;
  title: string;
  userName: string;
}

export const PLATFORM_SESSION_KEY = "foodsync-platform-session";

export const loadStoredPlatformSession = (): PlatformSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(PLATFORM_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PlatformSession;
  } catch {
    return null;
  }
};

export const saveStoredPlatformSession = (session: PlatformSession) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PLATFORM_SESSION_KEY, JSON.stringify(session));
};

export const clearStoredPlatformSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PLATFORM_SESSION_KEY);
};
