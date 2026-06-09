"use client";

import { useState, useMemo } from "react";
import { Search, Receipt, X } from "lucide-react";
import { toast } from "sonner";
import { cn, formatRupiah, formatDate, formatTime } from "@/lib/utils";
import { OrderDetailModal } from "./OrderDetailModal";
import { getOrderDetailAction } from "@/app/(dashboard)/orders/actions";
import type { Order } from "@/types";

interface OrdersInterfaceProps {
  orders: Order[];
}

export function OrdersInterface({ orders }: OrdersInterfaceProps) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.order_number.toLowerCase().includes(q));
    }
    if (dateFrom) {
      const from = new Date(dateFrom).setHours(0, 0, 0, 0);
      result = result.filter((o) => +new Date(o.created_at) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).setHours(23, 59, 59, 999);
      result = result.filter((o) => +new Date(o.created_at) <= to);
    }
    return result;
  }, [orders, search, dateFrom, dateTo]);

  const isFiltered = !!search.trim() || !!dateFrom || !!dateTo;

  const handleReset = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  const handleRowClick = async (orderId: string) => {
    setLoadingId(orderId);
    try {
      const detail = await getOrderDetailAction(orderId);
      if (detail) setDetailOrder(detail);
    } catch {
      toast.error("Gagal memuat detail order");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-5 p-6">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Cari no. order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-surface-raised pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Date range — dengan visible label */}
        <div className="flex items-center gap-2">
          <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface-raised px-3">
            <span className="shrink-0 text-xs text-text-secondary">Dari</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="Dari tanggal"
              className="min-w-0 bg-transparent text-sm text-text-primary focus:outline-none"
            />
          </label>
          <span className="text-xs text-text-secondary">—</span>
          <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface-raised px-3">
            <span className="shrink-0 text-xs text-text-secondary">Sampai</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="Sampai tanggal"
              className="min-w-0 bg-transparent text-sm text-text-primary focus:outline-none"
            />
          </label>
        </div>

        {/* Reset */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        )}
      </div>

      {/* Filter result count */}
      {isFiltered && (
        <p className="text-xs text-text-secondary">
          {filtered.length} dari {orders.length} order ditampilkan
        </p>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Receipt className="h-10 w-10 text-border" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text-secondary">
                {isFiltered ? "Tidak ada order sesuai filter" : "Belum ada order"}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {isFiltered
                  ? "Coba ubah rentang tanggal atau kata kunci"
                  : "Order akan muncul setelah kasir memproses transaksi pertama"}
              </p>
            </div>
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "No. Order", align: "" },
                    { label: "Kasir",     align: "" },
                    { label: "Total",     align: "text-right" },
                    { label: "Metode",    align: "" },
                    { label: "Status",    align: "" },
                    { label: "Waktu",     align: "text-right" },
                  ].map(({ label, align }) => (
                    <th
                      key={label}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary",
                        align,
                      )}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    className={cn(
                      "cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-surface-raised",
                      loadingId === order.id && "opacity-60",
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {order.profiles?.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-primary">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          order.payment_method === "cash"
                            ? "bg-warning/10 text-warning"
                            : "bg-accent/10 text-accent",
                        )}
                      >
                        {order.payment_method === "cash" ? "Tunai" : "QRIS"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        Selesai
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-text-secondary">
                      <span className="block">{formatDate(order.created_at)}</span>
                      <span>{formatTime(order.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailModal
        open={detailOrder !== null}
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
      />
    </div>
  );
}
