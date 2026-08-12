import "server-only";
import { createClient } from "@supabase/supabase-js";

// Full-access client for admin server actions — uses the secret service
// role key, which bypasses Row Level Security. Never import this from
// client components or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
