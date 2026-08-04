"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// @supabase/ssr handles PKCE code exchange automatically
// No custom storage needed - let it use localStorage by default
export const createClient = (): SupabaseClient => {
  return createBrowserClient(supabaseUrl, supabaseKey);
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
