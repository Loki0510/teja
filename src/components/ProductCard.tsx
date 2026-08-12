import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, isOnSale } from "@/lib/pricing";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const onSale = isOnSale(product);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-cream-dark relative overflow-hidden rounded-sm">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-light text-sm">
            No image
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute top-2 left-2 bg-surface/90 text-ink text-xs px-2 py-1 rounded-sm">
            Sold out
          </span>
        )}
        {product.in_stock && onSale && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-sm">
            -{discountPercent(product)}%
          </span>
        )}
        {product.video_url && (
          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center">
            ▶
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm text-ink group-hover:text-accent-dark transition-colors">
          {product.name}
        </p>
        <p className="text-sm flex items-center gap-2">
          <span className="text-accent font-medium">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {onSale && (
            <span className="text-muted-light line-through text-xs">
              ₹{product.compare_at_price!.toLocaleString("en-IN")}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
