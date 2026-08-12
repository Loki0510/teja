import { createClient } from "@supabase/supabase-js";

// Read-only client for Server Components — uses the public anon key.
// Products are readable by anyone via the RLS policy in supabase/schema.sql.
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
    );
  }

  return createClient(url, anonKey);
}
