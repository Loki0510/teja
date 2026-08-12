import Link from "next/link";
import Image from "next/image";
import { getAllProducts, isSupabaseConfigured } from "@/lib/products";
import { deleteProduct } from "@/app/admin/actions";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminDashboard() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getAllProducts() : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-ink">Admin — Products</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-accent text-white text-sm rounded-sm hover:bg-accent-dark transition-colors"
          >
            Add Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      {!configured && (
        <p className="text-sm text-muted mb-6">
          Supabase isn&apos;t configured yet — add your keys to{" "}
          <code className="px-1 py-0.5 bg-cream-dark rounded">.env.local</code>.
        </p>
      )}

      <div className="divide-y divide-line border border-line rounded-sm bg-surface">
        {products.length === 0 && (
          <p className="p-6 text-sm text-muted-light">No products yet.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <div className="w-14 h-16 relative bg-cream-dark rounded-sm overflow-hidden shrink-0">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink">{product.name}</p>
              <p className="text-xs text-muted-light">
                {product.category} · ₹{product.price.toLocaleString("en-IN")}{" "}
                {!product.in_stock && "· Sold out"}
              </p>
            </div>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="text-sm px-3 py-1.5 border border-line-strong text-ink rounded-sm hover:border-accent hover:text-accent transition-colors"
            >
              Edit
            </Link>
            <form action={deleteProduct.bind(null, product.id)}>
              <button
                type="submit"
                className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-sm"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
