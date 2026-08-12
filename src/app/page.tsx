import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import {
  getAllProducts,
  getClearanceProducts,
  isSupabaseConfigured,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const [products, clearanceProducts] = configured
    ? await Promise.all([getAllProducts(), getClearanceProducts()])
    : [[], []];

  return (
    <div>
      <section className="bg-gradient-to-b from-accent-soft/60 to-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-ink">
            Hand-Embroidery &amp; Block Print
          </h1>
          <div className="mt-4 mx-auto w-16 h-[2px] bg-gold" />
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Pret &amp; fusion ethnic wear, handcrafted and made to order.
            Every piece takes about 15 working days to create.
          </p>
        </div>
      </section>

      {!configured && (
        <div className="mx-auto max-w-6xl px-4 mb-12">
          <div className="border border-line rounded-sm p-6 text-sm text-muted bg-cream-dark">
            Supabase isn&apos;t configured yet, so no products can be shown.
            Add your Supabase URL and keys to{" "}
            <code className="px-1 py-0.5 bg-surface rounded">.env.local</code>{" "}
            to get started — see{" "}
            <code className="px-1 py-0.5 bg-surface rounded">README.md</code>.
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              className="border border-line rounded-sm p-6 text-center text-sm text-ink hover:border-gold hover:bg-gold-soft transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {clearanceProducts.length > 0 && (
        <section className="bg-accent-soft/50 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif text-ink">Clearance</h2>
              <Link
                href="/clearance"
                className="text-sm text-accent hover:text-accent-dark transition-colors"
              >
                Shop all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {clearanceProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif text-ink">New Arrivals</h2>
            <Link
              href="/new-arrivals"
              className="text-sm text-accent hover:text-accent-dark transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
