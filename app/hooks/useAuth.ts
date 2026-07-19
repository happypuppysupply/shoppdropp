"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/auth/AuthProvider";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values during SSR/static generation
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      signInWithEmail: async () => ({ error: null }),
      signUpWithEmail: async () => ({ error: null, data: null }),
      signInWithMagicLink: async () => ({ error: null }),
      signInWithGoogle: async () => {},
      signOut: async () => {},
    };
  }
  return context;
}
