"use client";

import Image from "next/image";
import { useState } from "react";
import { CATEGORIES, type Product } from "@/lib/types";

export function ProductForm({
  product,
  action,
}: {
  product?: Product;
  action: (formData: FormData) => void;
}) {
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images ?? []
  );

  return (
    <form action={action} className="space-y-5">
      <input
        type="hidden"
        name="existingImages"
        value={existingImages.join(",")}
      />

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

      {existingImages.length > 0 && (
        <div>
          <p className="text-sm mb-2 text-ink">Current images</p>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((url) => (
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
                    setExistingImages((imgs) => imgs.filter((u) => u !== url))
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
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="w-full text-sm text-ink"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-3 bg-accent text-white text-sm rounded-sm hover:bg-accent-dark transition-colors"
      >
        {product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
