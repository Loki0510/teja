import { getAllProducts, isSupabaseConfigured } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function NewArrivalsPage() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getAllProducts() : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-2 text-ink">New Arrivals</h1>
      <p className="text-sm text-muted mb-8">
        Our latest pieces, newest first.
      </p>

      {products.length === 0 ? (
        <p className="text-muted-light text-sm">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
