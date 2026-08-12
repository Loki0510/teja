import type { Product } from "@/lib/types";

export function isOnSale(product: Pick<Product, "price" | "compare_at_price">) {
  return (
    product.compare_at_price != null &&
    product.compare_at_price > product.price
  );
}

export function discountPercent(
  product: Pick<Product, "price" | "compare_at_price">
) {
  if (!isOnSale(product)) return 0;
  return Math.round(
    (1 - product.price / (product.compare_at_price as number)) * 100
  );
}
