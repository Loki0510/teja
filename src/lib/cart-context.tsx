"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "rukshaa-cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string | null) => void;
  updateQuantity: (
    productId: string,
    size: string | null,
    quantity: number
  ) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, productId: string, size: string | null) {
  return a.productId === productId && a.size === size;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item.productId, item.size));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.productId, item.size)
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, size: string | null) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, size)));
  };

  const updateQuantity = (
    productId: string,
    size: string | null,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((p) =>
        sameLine(p, productId, size) ? { ...p, quantity } : p
      )
    );
  };

  const clear = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
