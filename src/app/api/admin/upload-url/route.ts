import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "product-images";

// Mints one Supabase Storage signed-upload-url per requested file. The
// actual file bytes are then PUT directly from the browser to Supabase,
// never passing through this (or any) Vercel Function — Vercel Functions
// cap request bodies at 4.5MB regardless of Next.js config, which is far
// too small for full-resolution product photos.
export async function POST(request: Request) {
  await requireAdmin();
  const { count, extensions } = await request.json();

  if (typeof count !== "number" || count < 1 || count > 20) {
    return NextResponse.json({ error: "Invalid count" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  const uploads = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      const ext =
        (Array.isArray(extensions) && extensions[i]) || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(path);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);
      return {
        path,
        token: data.token,
        publicUrl: publicUrlData.publicUrl,
      };
    })
  );

  return NextResponse.json({ uploads });
}
