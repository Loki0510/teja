"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "product-images";

function parseList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildProductFields(formData: FormData) {
  const compareAtRaw = String(formData.get("compare_at_price") || "").trim();
  const videoUrl = String(formData.get("video_url") || "").trim();
  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    price: Number(formData.get("price")),
    compare_at_price: compareAtRaw ? Number(compareAtRaw) : null,
    category: String(formData.get("category") || "").trim(),
    // Images/video are uploaded directly to Supabase Storage from the
    // browser (see /api/admin/upload-url); these fields just carry the
    // resulting public URLs.
    images: parseList(formData.get("images")),
    video_url: videoUrl || null,
    sizes: parseList(formData.get("sizes")),
    in_stock: formData.get("in_stock") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const fields = buildProductFields(formData);

  const { error } = await supabase.from("products").insert(fields);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const fields = buildProductFields(formData);

  const { error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const { data: product } = await supabase
    .from("products")
    .select("images, video_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  const mediaUrls = [...(product?.images ?? []), product?.video_url].filter(
    (u): u is string => Boolean(u)
  );
  if (mediaUrls.length) {
    const paths = mediaUrls
      .map((url) => url.split(`${BUCKET}/`)[1])
      .filter(Boolean);
    if (paths.length) {
      await supabase.storage.from(BUCKET).remove(paths);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
