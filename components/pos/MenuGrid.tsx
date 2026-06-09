"use client";

import { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import type { MenuItem } from "@/types";

interface MenuGridProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

export function MenuGrid({ items, onAdd }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Coffee className="h-10 w-10 text-border" aria-hidden="true" />
        <p className="text-sm text-text-secondary">Tidak ada menu ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}

function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  const available = item.is_available;
  const [justAdded, setJustAdded] = useState(false);
  const cartQty = useCartStore((s) => s.items.find((i) => i.menuItemId === item.id)?.quantity ?? 0);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 350);
    return () => clearTimeout(t);
  }, [justAdded]);

  const handleAdd = () => {
    if (!available) return;
    onAdd(item);
    setJustAdded(true);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!available}
      className={cn(
        "relative flex flex-col rounded-lg border bg-surface p-4 text-left transition-[transform,border-color,background-color] duration-[150ms] ease-out active:scale-[0.97]",
        available
          ? cn(
              "cursor-pointer",
              justAdded
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent"
            )
          : "cursor-not-allowed border-border opacity-50"
      )}
    >
      {/* Image placeholder */}
      <div className="mb-3 flex h-14 w-full items-center justify-center rounded-md bg-surface-raised">
        <Coffee className="h-6 w-6 text-text-secondary" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{item.name}</p>
        {item.categories?.name && (
          <p className="mt-0.5 truncate text-xs text-text-secondary">{item.categories.name}</p>
        )}
      </div>

      <p className="mt-2 font-mono text-sm font-medium text-accent">
        {formatRupiah(item.price)}
      </p>

      {!available && (
        <span className="absolute right-2 top-2 rounded bg-error/20 px-1.5 py-0.5 text-xs font-medium text-error">
          Habis
        </span>
      )}
      {available && cartQty > 0 && (
        <span className="absolute right-2 top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-background">
          {cartQty}
        </span>
      )}
    </button>
  );
}
