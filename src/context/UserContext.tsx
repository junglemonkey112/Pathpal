"use client";

import { createContext, useContext, useState, useEffect, startTransition, ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserProfile {
  grade: string;
  gpa: string;
  interests: string[];
  targetMajor: string;
  targetSchools: string[];
  budget: string;
  hasSAT: boolean;
  satScore?: string;
  country?: string;
}

interface UserContextType {
  // Auth
  user: SupabaseUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithWeChat: () => void;
  signOut: () => Promise<void>;
  // Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (onboarded: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      startTransition(() => setIsLoading(false));
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      startTransition(() => setIsLoading(false));
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) return { error: "Authentication is not configured" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const supabase = createClient();
    if (!supabase) return { error: "Authentication is not configured" };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) return { error: "Authentication is not configured" };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    return { error: error?.message ?? null };
  };

  const signInWithWeChat = () => {
    // WeChat OAuth: redirect to custom API route which handles the WeChat flow
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/wechat/callback`);
    window.location.href = `/api/auth/wechat?redirect_uri=${redirectUri}`;
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithWeChat,
        signOut,
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
