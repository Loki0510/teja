"use client";

import { createClient } from "@supabase/supabase-js";

// Browser client using the public anon/publishable key — safe to expose.
// Used only for uploading directly to Supabase Storage via signed upload
// URLs, so large photo files never have to pass through our own server
// (Vercel Functions cap request bodies at 4.5MB, well under photo sizes).
export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
    );
  }

  return createClient(url, anonKey);
}
