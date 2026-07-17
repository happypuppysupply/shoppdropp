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
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null; data: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Lazy initialization of Supabase client
function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error("Missing Supabase environment variables");
    return null;
  }
  
  return createBrowserClient(url, key);
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
      const { data: { user }, error } = await supabaseRef.current!.auth.getUser();
      if (user && !error) {
        // Get session and save token
        const { data: { session } } = await supabaseRef.current!.auth.getSession();
        if (session?.access_token) {
          api.setToken(session.access_token);
        }
      }
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Listen for auth state changes
    const { data: listener } = supabaseRef.current.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.access_token) {
          api.setToken(session.access_token);
        } else {
          api.setToken(null);
        }
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
          emailRedirectTo: `https://shoppdropp-blueprint.vercel.app/auth/callback`,
        },
      });
      return { data, error };
    },
    []
  );

  const signInWithMagicLink = useCallback(
    async (email: string) => {
      if (!supabaseRef.current) return { error: new Error("Supabase not initialized") as AuthError };
      
      const { error } = await supabaseRef.current.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `https://shoppdropp-blueprint.vercel.app/auth/callback`,
        },
      });
      return { error };
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabaseRef.current) {
      console.error("Supabase not initialized");
      return;
    }
    
    try {
      const { data, error } = await supabaseRef.current.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error("Google OAuth error:", error);
        throw error;
      }
      
      console.log("Google OAuth initiated:", data);
    } catch (err) {
      console.error("Failed to sign in with Google:", err);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseRef.current) return;
    
    // Clear our custom token too
    localStorage.removeItem('token');
    
    await supabaseRef.current.auth.signOut();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
