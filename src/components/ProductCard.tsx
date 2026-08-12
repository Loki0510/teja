import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-black/5 relative overflow-hidden rounded-sm">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/30 text-sm">
            No image
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded-sm">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm">{product.name}</p>
        <p className="text-sm text-black/60">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
