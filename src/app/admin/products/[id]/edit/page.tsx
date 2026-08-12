import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-8 text-ink">Edit Product</h1>
      <ProductForm product={product} action={updateProduct.bind(null, id)} />
    </div>
  );
}
