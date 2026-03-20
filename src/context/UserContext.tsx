"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  grade: string;
  gpa: string;
  interests: string[];
  targetMajor: string;
  targetSchools: string[];
  budget: string;
  hasSAT: boolean;
  satScore?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (onboarded: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(true); // Default to true, no quiz modal

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        showOnboarding,
        setShowOnboarding,
        isOnboarded,
        setIsOnboarded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}