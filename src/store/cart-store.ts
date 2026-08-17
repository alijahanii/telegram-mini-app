"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  key: string;
  itemType: "product" | "gift";
  refId: number;
  title: string;
  subtitle?: string;
  icon?: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  maxStock?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = `${item.itemType}-${item.refId}`;
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key
                ? {
                    ...i,
                    quantity: Math.min(
                      i.quantity + item.quantity,
                      i.maxStock ?? Infinity,
                    ),
                  }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, key }] });
        }
      },
      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      updateQuantity: (key, quantity) =>
        set({
          items: get().items
            .map((i) => (i.key === key ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "teleshop-cart" },
  ),
);
