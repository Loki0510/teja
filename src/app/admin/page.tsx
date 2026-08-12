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
        <h1 className="text-2xl font-serif">Admin — Products</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-black text-white text-sm rounded-sm"
          >
            Add Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      {!configured && (
        <p className="text-sm text-black/60 mb-6">
          Supabase isn&apos;t configured yet — add your keys to{" "}
          <code className="px-1 py-0.5 bg-black/5 rounded">.env.local</code>.
        </p>
      )}

      <div className="divide-y divide-black/10 border border-black/10 rounded-sm">
        {products.length === 0 && (
          <p className="p-6 text-sm text-black/50">No products yet.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <div className="w-14 h-16 relative bg-black/5 rounded-sm overflow-hidden shrink-0">
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
              <p className="text-sm">{product.name}</p>
              <p className="text-xs text-black/50">
                {product.category} · ₹{product.price.toLocaleString("en-IN")}{" "}
                {!product.in_stock && "· Sold out"}
              </p>
            </div>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="text-sm px-3 py-1.5 border border-black/20 rounded-sm"
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
