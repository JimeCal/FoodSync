"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadAdminClientsSnapshot } from "@/lib/admin-storage";
import { usePlatformSession } from "@/lib/platform-session";
import { isHumanRole, type PlatformUserRole } from "@/lib/role-permissions";
import type { PlatformSession } from "@/lib/session-storage";
import { mockUser as initialMockUser, type Location } from "./mock-data";

type PlanId = "basic" | "plus" | "premium";
type SubscriptionType = "individual" | "multilocal";

export interface UserSettings {
  id: string;
  role: PlatformUserRole;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  plan: PlanId;
  subscriptionType: SubscriptionType;
  locations: Location[];
  currentLocationId?: string;
  notifications: {
    dailyRecommendation: boolean;
    highWasteAlert: boolean;
    weeklyReport: boolean;
    productNews: boolean;
  };
  twoFactorEnabled: boolean;
}

interface UserContextType {
  currentLocation: Location | null;
  hasFeature: (feature: string) => boolean;
  updateUser: (updates: Partial<UserSettings>) => void;
  updateNotifications: (key: keyof UserSettings["notifications"]) => void;
  changePlan: (newPlan: PlanId) => void;
  changeSubscriptionType: (type: SubscriptionType) => void;
  user: UserSettings;
}

const planFeatures: Record<PlanId, string[]> = {
  basic: [
    "dailyRecommendation",
    "weeklyReport",
    "basicDashboard",
    "simpleAlerts",
    "emailSupport",
  ],
  plus: [
    "dailyRecommendation",
    "weeklyReport",
    "basicDashboard",
    "simpleAlerts",
    "emailSupport",
    "historicalData",
    "advancedPrediction",
    "prioritySupport",
    "extendedReports",
  ],
  premium: [
    "dailyRecommendation",
    "weeklyReport",
    "basicDashboard",
    "simpleAlerts",
    "emailSupport",
    "historicalData",
    "advancedPrediction",
    "prioritySupport",
    "extendedReports",
    "multiLocation",
    "multiUser",
    "advancedAnalytics",
    "customReports",
    "dedicatedSupport",
    "apiAccess",
  ],
};

const defaultNotifications = {
  dailyRecommendation: true,
  highWasteAlert: true,
  weeklyReport: true,
  productNews: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const cloneLocations = (locations: Location[]) =>
  locations.map((location) => ({
    ...location,
    records: location.records.map((record) => ({ ...record })),
  }));

const buildFallbackUser = (): UserSettings => ({
  id: initialMockUser.id,
  role: "owner",
  name: initialMockUser.name,
  email: initialMockUser.email,
  businessName: initialMockUser.businessName,
  businessType: "Panaderia",
  plan: initialMockUser.plan as PlanId,
  subscriptionType: "individual",
  locations: cloneLocations(initialMockUser.locations),
  currentLocationId: initialMockUser.locations[0]?.id,
  notifications: defaultNotifications,
  twoFactorEnabled: false,
});

const buildUserFromSession = (session: PlatformSession | null): UserSettings => {
  if (!session || !isHumanRole(session.role) || !session.clientId) {
    return buildFallbackUser();
  }

  const clients = loadAdminClientsSnapshot();
  const client = clients.find((item) => item.id === session.clientId);

  if (!client) {
    return {
      ...buildFallbackUser(),
      id: session.credentialId,
      role: session.role,
      name: session.userName,
      email: session.email,
    };
  }

  const credential = client.credentials.find((item) => item.id === session.credentialId);
  const visibleLocations =
    session.role === "employee" && session.locationId
      ? client.locations.filter((location) => location.id === session.locationId)
      : client.locations;
  const normalizedLocations = visibleLocations.length > 0 ? visibleLocations : client.locations;
  const currentLocationId = normalizedLocations.some((location) => location.id === session.locationId)
    ? session.locationId
    : normalizedLocations[0]?.id;

  return {
    id: session.credentialId,
    role: session.role,
    name: session.userName,
    email: session.email,
    businessName: client.businessName,
    businessType: client.industry,
    plan: client.plan,
    subscriptionType: client.locations.length > 1 ? "multilocal" : "individual",
    locations: cloneLocations(normalizedLocations),
    currentLocationId,
    notifications: defaultNotifications,
    twoFactorEnabled: credential?.twoFactor ?? false,
  };
};

export function UserProvider({ children }: { children: ReactNode }) {
  const { session } = usePlatformSession();
  const [user, setUser] = useState<UserSettings>(() => buildUserFromSession(session));

  useEffect(() => {
    setUser(buildUserFromSession(session));
  }, [session]);

  const currentLocation =
    user.locations.find((location) => location.id === user.currentLocationId) ?? user.locations[0] ?? null;

  const updateUser = (updates: Partial<UserSettings>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateNotifications = (key: keyof UserSettings["notifications"]) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const changePlan = (newPlan: PlanId) => {
    setUser((prev) => ({ ...prev, plan: newPlan }));
  };

  const changeSubscriptionType = (type: SubscriptionType) => {
    setUser((prev) => ({ ...prev, subscriptionType: type }));
  };

  const hasFeature = (feature: string) => {
    const hasPlanFeature = planFeatures[user.plan].includes(feature);

    if (!hasPlanFeature) {
      return false;
    }

    if (feature === "multiLocation") {
      return user.subscriptionType === "multilocal" && user.locations.length > 1;
    }

    return true;
  };

  return (
    <UserContext.Provider
      value={{
        currentLocation,
        user,
        updateUser,
        updateNotifications,
        changePlan,
        changeSubscriptionType,
        hasFeature,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
