"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const image = product.images[activeImage];

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? null,
      size,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-[3/4] bg-black/5 relative overflow-hidden rounded-sm">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/30 text-sm">
              No image
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 relative rounded-sm overflow-hidden border ${
                  i === activeImage ? "border-black" : "border-black/10"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-serif">{product.name}</h1>
        <p className="mt-2 text-lg">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-black/40">
          {product.category}
        </p>

        {product.description && (
          <p className="mt-6 text-sm text-black/70 whitespace-pre-line">
            {product.description}
          </p>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-sm mb-2">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-sm border rounded-sm ${
                    size === s
                      ? "border-black bg-black text-white"
                      : "border-black/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm">Quantity</p>
          <div className="flex items-center border border-black/20 rounded-sm">
            <button
              className="w-8 h-8"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              className="w-8 h-8"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        {product.in_stock ? (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-black text-white text-sm rounded-sm hover:bg-black/80 transition-colors"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                handleAdd();
                router.push("/checkout");
              }}
              className="px-6 py-3 border border-black text-sm rounded-sm hover:bg-black/5 transition-colors"
            >
              Buy Now
            </button>
          </div>
        ) : (
          <p className="mt-8 text-sm text-black/50">
            Currently sold out. Message us on WhatsApp for restock updates.
          </p>
        )}
      </div>
    </div>
  );
}
