import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,user_id,full_name,phone")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

async function ensureProfileExists(user: User) {
  const existing = await fetchProfile(user.id).catch(() => null);
  if (existing) return;

  const fullName = (user.user_metadata as any)?.full_name ?? "";
  const phone = (user.user_metadata as any)?.phone ?? null;

  const { error } = await supabase.from("profiles").insert({
    user_id: user.id,
    full_name: String(fullName ?? ""),
    phone: phone ? String(phone) : null,
  });

  // If profile already exists due to race, ignore.
  if (error && !String(error.message).toLowerCase().includes("duplicate")) throw error;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile(user.id);
    setProfile(p);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const u = newSession?.user ?? null;
      setUser(u);

      try {
        if (u) {
          await ensureProfileExists(u);
          const p = await fetchProfile(u.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
      } catch {
        // fail closed (no profile)
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    // Ensure listener is ready before initial session fetch
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .finally(() => setLoading(false));

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      refreshProfile,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
