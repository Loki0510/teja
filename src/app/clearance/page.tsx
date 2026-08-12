import { getClearanceProducts, isSupabaseConfigured } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function ClearancePage() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getClearanceProducts() : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-2 text-ink">Clearance</h1>
      <p className="text-sm text-muted mb-8">
        Limited pieces at reduced prices, while stocks last.
      </p>

      {products.length === 0 ? (
        <p className="text-muted-light text-sm">
          Nothing on clearance right now — check back soon.
        </p>
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
