import "react-native-url-polyfill/auto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabaseConfig";

// Create a typed Supabase client instance for use across the app.
// This uses the public anon key only – never put service keys in the client.

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false, // we'll handle persistence manually with SecureStore
      },
    });
  }

  return supabase;
}


