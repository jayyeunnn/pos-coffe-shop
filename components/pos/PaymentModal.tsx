"use client";

import { useState } from "react";
import { Banknote, QrCode, CheckCircle2, Scan } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, formatRupiah } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

interface PaymentModalProps {
  open: boolean;
  total: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (
    method: PaymentMethod,
    cashReceived?: number,
    changeAmount?: number
  ) => void;
}

const QUICK_AMOUNTS = [20_000, 50_000, 100_000, 200_000];

export function PaymentModal({
  open,
  total,
  loading = false,
  onClose,
  onConfirm,
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [cashInput, setCashInput] = useState("");

  const cashReceived = parseInt(cashInput, 10) || 0;
  const change = cashReceived - total;
  const cashValid = cashReceived >= total;

  const handleConfirm = () => {
    if (method === "cash") {
      if (!cashValid) return;
      onConfirm("cash", cashReceived, change);
    } else {
      onConfirm("qris");
    }
  };

  const handleClose = () => {
    setCashInput("");
    setMethod("cash");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm gap-0 p-0">
        {/* Header */}
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-base">Pembayaran</DialogTitle>
        </DialogHeader>

        {/* Total tagihan — focal point, no box */}
        <div className="px-6 py-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
            Total Tagihan
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-text-primary">
            {formatRupiah(total)}
          </p>
        </div>

        <div className="space-y-5 border-t border-border px-6 pb-6 pt-5">
          {/* Segmented control — metode pembayaran */}
          <div className="flex rounded-lg bg-surface-raised p-1">
            {(["cash", "qris"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={method === m}
                onClick={() => setMethod(m)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-[transform,color,background-color,box-shadow] duration-[150ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  method === m
                    ? "bg-background text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {m === "cash" ? (
                  <Banknote className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <QrCode className="h-4 w-4" aria-hidden="true" />
                )}
                {m === "cash" ? "Tunai" : "QRIS"}
              </button>
            ))}
          </div>

          {/* ---- Seksi Tunai ---- */}
          {method === "cash" && (
            <div className="space-y-3">
              {/* Quick amounts — 2x2 grid */}
              <div className="grid grid-cols-2 gap-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashInput(String(amt))}
                    className={cn(
                      "h-11 rounded-md text-sm font-medium transition-[transform,color,background-color] duration-[150ms] ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      cashInput === String(amt)
                        ? "bg-accent/15 text-accent"
                        : "bg-surface-raised text-text-secondary hover:bg-accent/10 hover:text-accent"
                    )}
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>

              {/* Uang pas — full width, h-11 */}
              <button
                type="button"
                onClick={() => setCashInput(String(total))}
                className={cn(
                  "h-11 w-full rounded-md text-sm font-medium transition-[transform,color,background-color] duration-[150ms] ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  cashInput === String(total)
                    ? "bg-accent/15 text-accent"
                    : "bg-surface-raised text-text-secondary hover:bg-accent/10 hover:text-accent"
                )}
              >
                Uang Pas — {formatRupiah(total)}
              </button>

              {/* Input nominal */}
              <div>
                <label
                  htmlFor="cash-received"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  Nominal Diterima
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                    Rp
                  </span>
                  <input
                    id="cash-received"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    className="h-11 w-full rounded-md border border-border bg-surface-raised pl-10 pr-3 font-mono text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Kembalian */}
              {cashInput !== "" && (
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3",
                    change >= 0 ? "bg-success/10" : "bg-error/10"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {change >= 0 && (
                      <CheckCircle2
                        className="h-4 w-4 text-success"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm text-text-secondary">
                      Kembalian
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-lg font-bold",
                      change >= 0 ? "text-success" : "text-error"
                    )}
                  >
                    {change >= 0
                      ? formatRupiah(change)
                      : "Kurang " + formatRupiah(-change)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ---- Seksi QRIS ---- */}
          {method === "qris" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              {/* QR placeholder frame */}
              <div className="flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-raised">
                <div className="flex flex-col items-center gap-2">
                  <Scan className="h-10 w-10 text-accent" aria-hidden="true" />
                  <span className="text-xs font-medium text-text-secondary">
                    QRIS
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Arahkan kamera ke QR code
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  Konfirmasi setelah pelanggan selesai scan dan pembayaran masuk.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="w-1/3 shrink-0"
              onClick={handleClose}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={loading || (method === "cash" && !cashValid)}
            >
              {loading ? (
                "Memproses..."
              ) : (
                <>
                  {method === "cash" && cashValid && (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  Konfirmasi
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
