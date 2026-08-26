import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type Profile = { id: string; name: string | null; avatar_url: string | null; xp: number; level: number };
type AuthValue = { session: Session | null; user: User | null; profile: Profile | null; loading: boolean; refreshProfile: () => Promise<void> };
const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setProfile(null); return; }
    const { data } = await supabase.from("profiles").select("id, name, avatar_url, xp, level").eq("id", user.id).maybeSingle();
    setProfile(data);
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); if (data.session) void refreshProfile(); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); setLoading(false); if (next) setTimeout(() => void refreshProfile(), 0); else setProfile(null); });
    return () => subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, refreshProfile }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth deve ser usado dentro de AuthProvider."); return value; }
