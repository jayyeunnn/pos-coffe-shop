"use client";

import { useRef, useEffect } from "react";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { animate } from "animejs";
import { useCartStore } from "@/stores/cartStore";
import { formatRupiah } from "@/lib/utils";

interface CartPanelProps {
  onCheckout: () => void;
}

export function CartPanel({ onCheckout }: CartPanelProps) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const itemCount = useCartStore((s) => s.itemCount);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCountRef = useRef(0);

  // Bounce badge saat item ditambah ke cart
  useEffect(() => {
    if (itemCount > prevCountRef.current && badgeRef.current) {
      animate(badgeRef.current, {
        scale: [1.4, 1],
        duration: 250,
        ease: "outQuart",
      });
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Pesanan
        </h2>
        {itemCount > 0 && (
          <span
            ref={badgeRef}
            className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-background"
          >
            {itemCount}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <ShoppingCart className="h-12 w-12 text-border" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-text-secondary">Keranjang kosong</p>
            <p className="mt-1 text-xs text-text-secondary">Pilih menu untuk memulai</p>
          </div>
        </div>
      ) : (
        <>
          {/* Item list */}
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <div key={item.menuItemId} className="border-b border-border px-4 py-3">
                {/* Name + subtotal */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-text-primary">{item.name}</p>
                  <p className="shrink-0 font-mono text-sm font-medium text-text-primary">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>

                {/* Qty controls — 44px touch targets */}
                <div className="mt-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-md bg-surface-raised transition-[transform,background-color] duration-[150ms] ease-out hover:bg-accent/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={item.quantity === 1 ? "Hapus item" : "Kurang 1"}
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="h-3.5 w-3.5 text-error" />
                    ) : (
                      <Minus className="h-3.5 w-3.5 text-text-secondary" />
                    )}
                  </button>
                  <span className="w-8 text-center font-mono text-sm text-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-md bg-surface-raised transition-[transform,background-color] duration-[150ms] ease-out hover:bg-accent/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Tambah 1"
                  >
                    <Plus className="h-3.5 w-3.5 text-text-secondary" />
                  </button>
                  <span className="ml-2 font-mono text-xs text-text-secondary">
                    {formatRupiah(item.price)}/item
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer: total + CTA */}
          <div className="shrink-0 border-t border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total</span>
              <span className="font-mono text-xl font-bold text-text-primary">
                {formatRupiah(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="mt-3 h-11 w-full rounded-md bg-accent font-medium text-background transition-[transform,background-color] duration-[150ms] ease-out hover:bg-accent-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Proses Pembayaran
            </button>
          </div>
        </>
      )}
    </>
  );
}
