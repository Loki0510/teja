"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CATEGORIES, type Product } from "@/lib/types";
import { createBrowserSupabase } from "@/lib/supabase/client";

const BUCKET = "product-images";

export function ProductForm({
  product,
  action,
}: {
  product?: Product;
  action: (formData: FormData) => void;
}) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: files.length,
          extensions: files.map((f) => f.name.split(".").pop() || "jpg"),
        }),
      });
      if (!res.ok) throw new Error("Could not prepare upload.");
      const { uploads } = (await res.json()) as {
        uploads: { path: string; token: string; publicUrl: string }[];
      };

      const supabase = createBrowserSupabase();
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const { path, token, publicUrl } = uploads[i];
        const { error } = await supabase.storage
          .from(BUCKET)
          .uploadToSignedUrl(path, token, files[i]);
        if (error) throw error;
        uploadedUrls.push(publicUrl);
      }

      setImages((imgs) => [...imgs, ...uploadedUrls]);
    } catch {
      setUploadError("Some photos failed to upload. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="images" value={images.join(",")} />

      <div>
        <label className="block text-sm mb-1 text-ink">Name</label>
        <input
          required
          name="name"
          defaultValue={product?.name}
          className="w-full border border-line-strong rounded-sm px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-ink">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={4}
          className="w-full border border-line-strong rounded-sm px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-ink">Price (₹)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="price"
            defaultValue={product?.price}
            className="w-full border border-line-strong rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink">
            Original price (₹, optional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="compare_at_price"
            defaultValue={product?.compare_at_price ?? ""}
            placeholder="Leave blank if not on sale"
            className="w-full border border-line-strong rounded-sm px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted-light">
            Setting this higher than Price shows a strikethrough price and
            lists the product on the Clearance page.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-ink">Category</label>
        <select
          required
          name="category"
          defaultValue={product?.category ?? CATEGORIES[0]}
          className="w-full border border-line-strong rounded-sm px-3 py-2 text-sm bg-surface text-ink"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1 text-ink">
          Sizes (comma separated, optional — e.g. S, M, L, XL)
        </label>
        <input
          name="sizes"
          defaultValue={product?.sizes?.join(", ") ?? ""}
          className="w-full border border-line-strong rounded-sm px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="in_stock"
          type="checkbox"
          name="in_stock"
          defaultChecked={product?.in_stock ?? true}
        />
        <label htmlFor="in_stock" className="text-sm text-ink">
          In stock
        </label>
      </div>

      {images.length > 0 && (
        <div>
          <p className="text-sm mb-2 text-ink">Photos</p>
          <div className="flex gap-2 flex-wrap">
            {images.map((url) => (
              <div key={url} className="relative w-20 h-24">
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover rounded-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((imgs) => imgs.filter((u) => u !== url))
                  }
                  className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white rounded-full text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm mb-1 text-ink">Add photos</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          disabled={uploading}
          className="w-full text-sm text-ink"
        />
        <p className="mt-1 text-xs text-muted-light">
          Photos upload straight to storage, so full-resolution files are
          fine (up to Supabase&apos;s per-file limit, ~50MB by default).
        </p>
        {uploading && (
          <p className="mt-1 text-xs text-accent">Uploading photos…</p>
        )}
        {uploadError && (
          <p className="mt-1 text-xs text-red-600">{uploadError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="px-6 py-3 bg-accent text-white text-sm rounded-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
      >
        {product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
