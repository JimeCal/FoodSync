"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearStoredPlatformSession, loadStoredPlatformSession, saveStoredPlatformSession, type PlatformSession } from "@/lib/session-storage";
import { hasRolePermission, type PlatformPermission } from "@/lib/role-permissions";

interface PlatformSessionContextValue {
  hasPermission: (permission: PlatformPermission) => boolean;
  isReady: boolean;
  login: (session: PlatformSession) => void;
  logout: () => void;
  session: PlatformSession | null;
}

const PlatformSessionContext = createContext<PlatformSessionContextValue | undefined>(undefined);

export function PlatformSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PlatformSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(loadStoredPlatformSession());
    setIsReady(true);
  }, []);

  const login = (nextSession: PlatformSession) => {
    saveStoredPlatformSession(nextSession);
    setSession(nextSession);
  };

  const logout = () => {
    clearStoredPlatformSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      hasPermission: (permission: PlatformPermission) =>
        hasRolePermission(session?.role, permission),
      isReady,
      login,
      logout,
      session,
    }),
    [isReady, session],
  );

  return (
    <PlatformSessionContext.Provider value={value}>
      {children}
    </PlatformSessionContext.Provider>
  );
}

export function usePlatformSession() {
  const context = useContext(PlatformSessionContext);

  if (!context) {
    throw new Error("usePlatformSession must be used within a PlatformSessionProvider");
  }

  return context;
}
