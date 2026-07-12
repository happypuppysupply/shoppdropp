import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const isBuild = typeof window === 'undefined' && process.env.NODE_ENV === 'production'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Graceful client for SSR/build - prevents crash when env vars missing
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export type User = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user']