"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-accent text-white text-sm rounded-sm hover:bg-accent-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-8 text-ink">Your Cart</h1>

      <div className="divide-y divide-line">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size ?? "nosize"}`}
            className="flex gap-4 py-4"
          >
            <div className="w-20 h-24 relative bg-cream-dark rounded-sm overflow-hidden shrink-0">
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
              <p className="text-sm text-ink">{item.name}</p>
              {item.size && (
                <p className="text-xs text-muted-light mt-0.5">
                  Size: {item.size}
                </p>
              )}
              <p className="text-sm text-accent mt-1">
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center border border-line-strong rounded-sm text-ink">
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
                  className="text-xs text-muted-light hover:text-accent"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="text-sm text-ink">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-sm text-muted">Total</p>
        <p className="text-lg text-accent font-medium">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>

      <Link
        href="/checkout"
        className="mt-8 block text-center px-6 py-3 bg-whatsapp text-white text-sm rounded-sm hover:bg-whatsapp-dark transition-colors"
      >
        Checkout via WhatsApp
      </Link>
    </div>
  );
}
