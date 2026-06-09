import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (menuItemId: string, name: string, price: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, qty: number) => void;
  clearCart: () => void;
}

function recompute(items: CartItem[]) {
  return {
    total: items.reduce((s, i) => s + i.subtotal, 0),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (menuItemId, name, price) => {
        const { items } = get();
        const idx = items.findIndex((i) => i.menuItemId === menuItemId);
        const newItems =
          idx >= 0
            ? items.map((i, j) =>
                j === idx
                  ? {
                      ...i,
                      quantity: i.quantity + 1,
                      subtotal: (i.quantity + 1) * i.price,
                    }
                  : i
              )
            : [...items, { menuItemId, name, price, quantity: 1, subtotal: price }];
        set({ items: newItems, ...recompute(newItems) });
      },

      removeItem: (menuItemId) => {
        const newItems = get().items.filter((i) => i.menuItemId !== menuItemId);
        set({ items: newItems, ...recompute(newItems) });
      },

      updateQuantity: (menuItemId, qty) => {
        const newItems =
          qty <= 0
            ? get().items.filter((i) => i.menuItemId !== menuItemId)
            : get().items.map((i) =>
                i.menuItemId === menuItemId
                  ? { ...i, quantity: qty, subtotal: qty * i.price }
                  : i
              );
        set({ items: newItems, ...recompute(newItems) });
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: "brewdesk-cart",
      storage: createJSONStorage(() => sessionStorage),
      // skipHydration mencegah SSR/client mismatch; rehydrate manual saat mount
      skipHydration: true,
    }
  )
);
