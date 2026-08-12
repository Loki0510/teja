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
