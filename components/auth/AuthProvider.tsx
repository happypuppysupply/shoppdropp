"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { User, AuthError, Session, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null; data: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Hardcoded Supabase credentials for production
const SUPABASE_URL = "https://tdokcqkdtwzhjvdkspls.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2tjcWtkdHd6aGp2ZGtzcGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTI1NjMsImV4cCI6MjA2NjQ4ODU2M30.XPZdQFS4CFc-mOqdyvZvT6U7M5r5XyYFW0pgyfo8d3o";

// Lazy initialization of Supabase client
function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  
  // Use hardcoded values directly (public anon key is safe for client)
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  // Initialize client only on mount
  useEffect(() => {
    supabaseRef.current = getSupabaseClient();
    
    if (!supabaseRef.current) {
      setIsLoading(false);
      return;
    }

    // Check active sessions
    const getUser = async () => {
      const { data: { user } } = await supabaseRef.current!.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Listen for auth state changes
    const { data: listener } = supabaseRef.current.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabaseRef.current) return { error: new Error("Supabase not initialized") as AuthError };
      
      const { error } = await supabaseRef.current.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabaseRef.current) return { data: null, error: new Error("Supabase not initialized") as AuthError };
      
      const { data, error } = await supabaseRef.current.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { data, error };
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabaseRef.current) return;
    
    await supabaseRef.current.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseRef.current) return;
    
    await supabaseRef.current.auth.signOut();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
