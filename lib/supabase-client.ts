"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Cookie-based storage adapter for PKCE verifier persistence
// This is required for OAuth to work in incognito/private browsing mode
const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return;
    // Set cookie with SameSite=Lax to allow it to persist through OAuth redirect
    // Longer max-age (24 hours) to ensure it survives the OAuth flow
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax${secure}`;
  },
  removeItem: (key: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

// Shared configuration for cookie-based auth storage
// This ensures PKCE code verifier persists across OAuth redirects
export const createClient = (): SupabaseClient => {
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: cookieStorage,
      storageKey: "sb-auth-token",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

// Singleton instance for client-side use
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient can only be used in browser");
  }
  
  if (!clientInstance) {
    clientInstance = createClient();
  }
  
  return clientInstance;
};
