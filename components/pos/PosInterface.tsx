"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cn, formatRupiah } from "@/lib/utils";
import { CategoryFilter } from "./CategoryFilter";
import { MenuGrid } from "./MenuGrid";
import { CartPanel } from "./CartPanel";
import { PaymentModal } from "./PaymentModal";
import { ReceiptModal } from "./ReceiptModal";
import { createOrderAction } from "@/app/(dashboard)/pos/actions";
import { useCartStore } from "@/stores/cartStore";
import type {
  MenuItem,
  Category,
  CafeSettings,
  PaymentMethod,
  CreateOrderPayload,
  ReceiptData,
} from "@/types";

interface PosInterfaceProps {
  menuItems: MenuItem[];
  categories: Category[];
  cafeSettings: CafeSettings;
}

export function PosInterface({
  menuItems,
  categories,
  cafeSettings,
}: PosInterfaceProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const total = useCartStore((s) => s.total);
  const itemCount = useCartStore((s) => s.itemCount);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleConfirmPayment = async (
    method: PaymentMethod,
    cashReceived?: number,
    changeAmount?: number
  ) => {
    setProcessing(true);
    try {
      const { items, total: orderTotal } = useCartStore.getState();

      const payload: CreateOrderPayload = {
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          unitPrice: i.price,
          quantity: i.quantity,
          subtotal: i.subtotal,
        })),
        subtotal: orderTotal,
        total: orderTotal,
        paymentMethod: method,
        cashReceived: method === "cash" ? cashReceived : undefined,
        changeAmount: method === "cash" ? changeAmount : undefined,
      };

      const order = await createOrderAction(payload);

      const receiptData: ReceiptData = {
        orderNumber: order.order_number,
        cafeName: cafeSettings.cafe_name,
        cafeAddress: cafeSettings.address,
        cashierName: order.profiles?.full_name ?? "Kasir",
        items: (order.order_items ?? []).map((oi) => ({
          name: oi.name,
          quantity: oi.quantity,
          unitPrice: oi.unit_price,
          subtotal: oi.subtotal,
        })),
        subtotal: order.subtotal,
        total: order.total,
        paymentMethod: order.payment_method,
        cashReceived: order.cash_received,
        changeAmount: order.change_amount,
        footerNote: cafeSettings.footer_note,
        createdAt: order.created_at,
      };

      clearCart();
      setMobileCartOpen(false);
      setPaymentOpen(false);
      setReceipt(receiptData);
      setReceiptOpen(true);
    } catch {
      toast.error("Gagal menyimpan order. Coba lagi.");
    } finally {
      setProcessing(false);
    }
  };

  const filtered = useMemo(() => {
    let result = menuItems;
    if (activeCategory) {
      result = result.filter((m) => m.category_id === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    return result;
  }, [menuItems, activeCategory, search]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ---- Left: menu panel ---- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 flex-col gap-3 border-b border-border p-4 lg:p-5">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-surface-raised pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <CategoryFilter
            categories={categories}
            activeId={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {/* Add pb-20 on mobile to prevent last item hiding behind the cart bar */}
        <div className="flex-1 overflow-y-auto p-4 pb-20 lg:p-5 lg:pb-5">
          <MenuGrid
            items={filtered}
            onAdd={(item) => addItem(item.id, item.name, item.price)}
          />
        </div>
      </div>

      {/* ---- Right: cart panel (hidden below lg) ---- */}
      <aside className="hidden w-80 flex-shrink-0 flex-col border-l border-border bg-surface lg:flex xl:w-[360px]">
        <CartPanel onCheckout={() => setPaymentOpen(true)} />
      </aside>

      {/* ---- Mobile: sticky cart bar (shows when cart has items) ---- */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/90 p-3 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setMobileCartOpen(true)}
            className="flex h-12 w-full items-center justify-between rounded-lg bg-accent px-4 transition-colors hover:bg-accent-hover"
            aria-label="Lihat keranjang"
          >
            <span className="flex items-center gap-2 font-medium text-background">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span>{itemCount} item</span>
            </span>
            <span className="font-mono font-bold text-background">
              {formatRupiah(total)}
            </span>
          </button>
        </div>
      )}

      {/* ---- Mobile: cart bottom sheet ---- */}
      <div
        className={cn(
          "fixed inset-0 z-30 lg:hidden",
          mobileCartOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileCartOpen}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-200",
            mobileCartOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileCartOpen(false)}
        />
        {/* Sheet */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 flex max-h-[82vh] flex-col rounded-t-2xl border-t border-border bg-surface transition-transform duration-300 ease-out",
            mobileCartOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mx-auto mb-3 mt-3 h-1 w-12 rounded-full bg-border" />
          <CartPanel
            onCheckout={() => {
              setMobileCartOpen(false);
              setPaymentOpen(true);
            }}
          />
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        total={total}
        loading={processing}
        onClose={() => setPaymentOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      <ReceiptModal
        open={receiptOpen}
        receipt={receipt}
        onClose={() => {
          setReceiptOpen(false);
          setReceipt(null);
        }}
      />
    </div>
  );
}
