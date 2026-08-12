import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-8 text-ink">Add Product</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
