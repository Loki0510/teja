import { createServerSupabase } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isConfigured()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  if (!isConfigured()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getClearanceProducts(): Promise<Product[]> {
  if (!isConfigured()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("compare_at_price", "is", null)
    .order("created_at", { ascending: false });
  if (error) {
    // Tolerate the compare_at_price migration not having been run yet
    // (Postgres 42703 = undefined column) so the rest of the site still
    // builds/renders instead of erroring the whole page.
    if (error.code === "42703") return [];
    throw error;
  }
  // Belt-and-suspenders: only treat it as on sale if compare_at_price
  // actually exceeds price, in case of stale/bad data.
  return (data ?? []).filter(
    (p) => p.compare_at_price != null && p.compare_at_price > p.price
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isConfigured()) return null;
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export { isConfigured as isSupabaseConfigured };
