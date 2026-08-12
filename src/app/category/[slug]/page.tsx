import { getProductsByCategory, isSupabaseConfigured } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const configured = isSupabaseConfigured();
  const products = configured ? await getProductsByCategory(category) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-8">{category}</h1>

      {products.length === 0 ? (
        <p className="text-black/50 text-sm">
          No products in this category yet.
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
