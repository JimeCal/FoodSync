"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { mockUser as initialMockUser } from "./mock-data";

type PlanId = "basic" | "plus" | "premium";
type SubscriptionType = "individual" | "multilocal";

export interface UserSettings {
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  plan: PlanId;
  subscriptionType: SubscriptionType;
  notifications: {
    dailyRecommendation: boolean;
    highWasteAlert: boolean;
    weeklyReport: boolean;
    productNews: boolean;
  };
  twoFactorEnabled: boolean;
}

interface UserContextType {
  user: UserSettings;
  updateUser: (updates: Partial<UserSettings>) => void;
  updateNotifications: (key: keyof UserSettings["notifications"]) => void;
  changePlan: (newPlan: PlanId) => void;
  changeSubscriptionType: (type: SubscriptionType) => void;
  hasFeature: (feature: string) => boolean;
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

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSettings>({
    name: initialMockUser.name,
    email: initialMockUser.email,
    businessName: initialMockUser.businessName,
    businessType: "Panaderia",
    plan: initialMockUser.plan as PlanId,
    subscriptionType: "individual",
    notifications: {
      dailyRecommendation: true,
      highWasteAlert: true,
      weeklyReport: true,
      productNews: false,
    },
    twoFactorEnabled: false,
  });

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
    return planFeatures[user.plan].includes(feature);
  };

  return (
    <UserContext.Provider
      value={{
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
