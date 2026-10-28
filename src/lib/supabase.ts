import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client.
 *
 * Reads configuration from environment variables:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY   (the publishable / anon key — safe for the browser
 *                             ONLY because every table is protected by RLS)
 *
 * The app is designed to run WITHOUT Supabase configured: in that case the
 * public website renders the built-in fallback content and the admin panel
 * shows a friendly "not configured" message. No fake/hardcoded auth is used.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith('http') && anonKey.length > 20,
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/** Name of the Supabase Storage bucket used for all media. */
export const MEDIA_BUCKET = 'media'
