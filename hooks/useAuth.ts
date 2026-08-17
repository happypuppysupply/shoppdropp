"use client";

import { useContext } from "react";
import { AuthContext } from "../components/auth/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Map AuthProvider API to the expected AuthModal API
  const signInWithEmail = async (email: string, _password?: string) => {
    try {
      await context.login(email);
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || "Login failed" } };
    }
  };

  const signUpWithEmail = async (email: string, _password?: string) => {
    try {
      await context.register(email);
      return { error: null, data: null };
    } catch (error: any) {
      return { error: { message: error.message || "Registration failed" }, data: null };
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error: any) {
      return { error: { message: error.message || "Magic link failed" } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return {
    ...context,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signInWithGoogle,
    isLoading: context.loading,
    isAuthenticated: !!context.user,
  };
}
