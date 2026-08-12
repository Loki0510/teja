"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { discountPercent, isOnSale } from "@/lib/pricing";

type Slide = { type: "image" | "video"; url: string };

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();

  const slides: Slide[] = [
    ...product.images.map((url): Slide => ({ type: "image", url })),
    ...(product.video_url
      ? [{ type: "video", url: product.video_url } as Slide]
      : []),
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [size, setSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const current = slides[activeSlide];
  const onSale = isOnSale(product);

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
        <div className="aspect-[3/4] bg-cream-dark relative overflow-hidden rounded-sm">
          {current?.type === "video" ? (
            <video
              src={current.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : current ? (
            <Image
              src={current.url}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-light text-sm">
              No image
            </div>
          )}
        </div>
        {product.in_stock && onSale && (
          <span className="inline-block mt-3 bg-accent text-white text-xs px-2 py-1 rounded-sm">
            {discountPercent(product)}% off
          </span>
        )}
        {slides.length > 1 && (
          <div className="mt-3 flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.url + i}
                onClick={() => setActiveSlide(i)}
                className={`w-16 h-20 relative rounded-sm overflow-hidden border ${
                  i === activeSlide ? "border-accent" : "border-line"
                }`}
              >
                {slide.type === "video" ? (
                  <>
                    <video
                      src={slide.url}
                      muted
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs">
                      ▶
                    </span>
                  </>
                ) : (
                  <Image src={slide.url} alt="" fill className="object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-serif text-ink">{product.name}</h1>
        <p className="mt-2 flex items-center gap-3">
          <span className="text-xl text-accent font-medium">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {onSale && (
            <span className="text-muted-light line-through">
              ₹{product.compare_at_price!.toLocaleString("en-IN")}
            </span>
          )}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-light">
          {product.category}
        </p>

        {product.description && (
          <p className="mt-6 text-sm text-muted whitespace-pre-line">
            {product.description}
          </p>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-sm mb-2 text-ink">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-sm border rounded-sm ${
                    size === s
                      ? "border-accent bg-accent text-white"
                      : "border-line-strong text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm text-ink">Quantity</p>
          <div className="flex items-center border border-line-strong rounded-sm text-ink">
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
              className="px-6 py-3 bg-accent text-white text-sm rounded-sm hover:bg-accent-dark transition-colors"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                handleAdd();
                router.push("/checkout");
              }}
              className="px-6 py-3 border border-accent text-accent text-sm rounded-sm hover:bg-accent-soft transition-colors"
            >
              Buy Now
            </button>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-light">
            Currently sold out. Message us on WhatsApp for restock updates.
          </p>
        )}
      </div>
    </div>
  );
}
