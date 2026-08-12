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

async function uploadNewImages(
  supabase: ReturnType<typeof createAdminSupabase>,
  formData: FormData
) {
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

function buildProductFields(formData: FormData, newImageUrls: string[]) {
  const existingImages = parseList(formData.get("existingImages"));
  const compareAtRaw = String(formData.get("compare_at_price") || "").trim();
  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    price: Number(formData.get("price")),
    compare_at_price: compareAtRaw ? Number(compareAtRaw) : null,
    category: String(formData.get("category") || "").trim(),
    images: [...existingImages, ...newImageUrls],
    sizes: parseList(formData.get("sizes")),
    in_stock: formData.get("in_stock") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const newImageUrls = await uploadNewImages(supabase, formData);
  const fields = buildProductFields(formData, newImageUrls);

  const { error } = await supabase.from("products").insert(fields);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const newImageUrls = await uploadNewImages(supabase, formData);
  const fields = buildProductFields(formData, newImageUrls);

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
    .select("images")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  if (product?.images?.length) {
    const paths = product.images
      .map((url: string) => url.split(`${BUCKET}/`)[1])
      .filter(Boolean);
    if (paths.length) {
      await supabase.storage.from(BUCKET).remove(paths);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
