"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildOrderMessage(items, { name, phone, address, notes });
    const link = buildWhatsAppLink(message);
    window.open(link, "_blank");
    clear();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-serif mb-2">Checkout</h1>
      <p className="text-sm text-black/60 mb-8">
        Fill in your details and we&apos;ll open WhatsApp with your order
        ready to send. We&apos;ll confirm availability, sizing and payment
        with you there.
      </p>

      <div className="border border-black/10 rounded-sm p-4 mb-8 text-sm">
        <p className="mb-2 text-black/60">Order summary</p>
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size ?? "nosize"}`}
            className="flex justify-between py-1"
          >
            <span>
              {item.name}
              {item.size ? ` (${item.size})` : ""} x{item.quantity}
            </span>
            <span>
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-2 border-t border-black/10">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black/20 rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone number</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-black/20 rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Delivery address</label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full border border-black/20 rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">
            Notes (optional — custom sizing, occasion date, etc.)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-black/20 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-black text-white text-sm rounded-sm hover:bg-black/80 transition-colors"
        >
          Send Order via WhatsApp
        </button>
      </form>
    </div>
  );
}
