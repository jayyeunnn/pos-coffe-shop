"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatRupiah, formatDate, formatTime } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderDetailModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ open, order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const items = order.order_items ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">{order.order_number}</DialogTitle>
        </DialogHeader>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span>{formatDate(order.created_at)} · {formatTime(order.created_at)}</span>
          <span>Kasir: {order.profiles?.full_name ?? "—"}</span>
        </div>

        {/* Items */}
        <div className="rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left text-xs font-medium text-text-secondary">Item</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-text-secondary">Qty</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-text-secondary">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 text-text-primary">{item.name}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-text-secondary">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-text-primary">
                    {formatRupiah(item.subtotal)}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-xs text-text-secondary">
                    Tidak ada item
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment summary */}
        <div className="space-y-2 rounded-lg bg-surface-raised p-4 text-sm">
          <div className="flex justify-between font-bold text-text-primary">
            <span>Total</span>
            <span className="font-mono">{formatRupiah(order.total)}</span>
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Metode</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                order.payment_method === "cash"
                  ? "bg-warning/10 text-warning"
                  : "bg-accent/10 text-accent",
              )}
            >
              {order.payment_method === "cash" ? "Tunai" : "QRIS"}
            </span>
          </div>
          {order.payment_method === "cash" && order.cash_received !== null && (
            <>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Diterima</span>
                <span className="font-mono">{formatRupiah(order.cash_received)}</span>
              </div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Kembalian</span>
                <span className="font-mono">{formatRupiah(order.change_amount ?? 0)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Status</span>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              Selesai
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
