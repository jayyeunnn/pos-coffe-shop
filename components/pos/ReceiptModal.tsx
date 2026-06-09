"use client";

import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate, formatTime } from "@/lib/utils";
import type { ReceiptData } from "@/types";

interface ReceiptModalProps {
  open: boolean;
  receipt: ReceiptData | null;
  onClose: () => void;
}

export function ReceiptModal({ open, receipt, onClose }: ReceiptModalProps) {
  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Struk Pembayaran</DialogTitle>
        </DialogHeader>

        {/* Receipt body */}
        <div
          id="receipt-print"
          className="rounded-lg border border-border bg-surface-raised p-4 font-mono text-sm"
        >
          {/* Header cafe */}
          <div className="text-center">
            <p className="text-base font-bold text-text-primary">
              {receipt.cafeName}
            </p>
            {receipt.cafeAddress && (
              <p className="mt-0.5 text-xs text-text-secondary">
                {receipt.cafeAddress}
              </p>
            )}
            <p className="mt-1 text-xs text-text-secondary">
              {formatDate(receipt.createdAt)} · {formatTime(receipt.createdAt)}
            </p>
            <p className="text-xs text-text-secondary">
              No: {receipt.orderNumber}
            </p>
            <p className="text-xs text-text-secondary">
              Kasir: {receipt.cashierName}
            </p>
          </div>

          <div className="my-3 border-t border-dashed border-border" />

          {/* Items */}
          <div className="space-y-1.5">
            {receipt.items.map((item, i) => (
              <div key={i} className="flex justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="truncate text-text-primary">{item.name}</span>
                  <span className="ml-2 text-xs text-text-secondary">
                    x{item.quantity}
                  </span>
                </div>
                <span className="shrink-0 text-text-primary">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-dashed border-border" />

          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-text-primary">
              <span>Total</span>
              <span>{formatRupiah(receipt.total)}</span>
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Metode</span>
              <span>{receipt.paymentMethod === "cash" ? "Tunai" : "QRIS"}</span>
            </div>
            {receipt.paymentMethod === "cash" && receipt.cashReceived !== null && (
              <>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Diterima</span>
                  <span>{formatRupiah(receipt.cashReceived)}</span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Kembalian</span>
                  <span>{formatRupiah(receipt.changeAmount ?? 0)}</span>
                </div>
              </>
            )}
          </div>

          {receipt.footerNote && (
            <>
              <div className="my-3 border-t border-dashed border-border" />
              <p className="text-center text-xs text-text-secondary">
                {receipt.footerNote}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Tutup
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
