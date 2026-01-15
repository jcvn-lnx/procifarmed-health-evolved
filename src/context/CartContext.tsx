import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/catalog";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "procifarmed_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const api = useMemo<CartContextValue>(() => {
    const count = items.reduce((acc, it) => acc + it.quantity, 0);
    const subtotalCents = items.reduce((acc, it) => acc + it.quantity * it.product.priceCents, 0);

    return {
      items,
      count,
      subtotalCents,
      add: (product, quantity = 1) => {
        setItems((prev) => {
          const idx = prev.findIndex((p) => p.product.id === product.id);
          if (idx === -1) return [...prev, { product, quantity }];
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        });
      },
      remove: (productId) => setItems((prev) => prev.filter((p) => p.product.id !== productId)),
      setQuantity: (productId, quantity) => {
        setItems((prev) =>
          prev
            .map((p) => (p.product.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p))
            .filter((p) => p.quantity > 0),
        );
      },
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
