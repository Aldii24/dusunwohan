import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

/**
 * Client anon tanpa cookie/session — untuk halaman publik (RSC).
 * Tidak menyentuh cookies() sehingga halaman tetap bisa di-cache/ISR.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
