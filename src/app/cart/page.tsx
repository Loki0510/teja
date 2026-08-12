"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-black/60">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-black text-white text-sm rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-8">Your Cart</h1>

      <div className="divide-y divide-black/10">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size ?? "nosize"}`}
            className="flex gap-4 py-4"
          >
            <div className="w-20 h-24 relative bg-black/5 rounded-sm overflow-hidden shrink-0">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm">{item.name}</p>
              {item.size && (
                <p className="text-xs text-black/50 mt-0.5">
                  Size: {item.size}
                </p>
              )}
              <p className="text-sm text-black/60 mt-1">
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center border border-black/20 rounded-sm">
                  <button
                    className="w-7 h-7 text-sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="w-7 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    className="w-7 h-7 text-sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-xs text-black/40 hover:text-black/70"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="text-sm">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-sm text-black/60">Total</p>
        <p className="text-lg">₹{total.toLocaleString("en-IN")}</p>
      </div>

      <Link
        href="/checkout"
        className="mt-8 block text-center px-6 py-3 bg-black text-white text-sm rounded-sm hover:bg-black/80 transition-colors"
      >
        Checkout via WhatsApp
      </Link>
    </div>
  );
}
