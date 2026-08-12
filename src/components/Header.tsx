"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Rukshaa";

  return (
    <header className="border-b border-line sticky top-0 bg-cream/90 backdrop-blur z-30">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-serif tracking-wide text-accent-dark">
          {siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              className="hover:text-accent transition-colors"
            >
              {cat}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-sm hover:text-accent transition-colors">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-accent text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden text-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line px-4 py-3 flex flex-col gap-3 text-sm">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              onClick={() => setOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
