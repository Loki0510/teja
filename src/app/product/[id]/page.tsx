import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <ProductDetail product={product} />
    </div>
  );
}
