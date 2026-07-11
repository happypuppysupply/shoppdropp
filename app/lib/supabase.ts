import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (client) return client;

  // Only create client in browser, not during build/prerender
  if (typeof window === "undefined") {
    // Return a mock client for SSR/build that will be replaced on hydration
    throw new Error("Supabase client should only be used in browser");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  client = createBrowserClient(url, key);
  return client;
}

// Safe client creation that returns null during SSR
export function getClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  
  try {
    return createClient();
  } catch {
    return null;
  }
}
